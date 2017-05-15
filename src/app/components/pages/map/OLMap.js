/**
 * Encapsulate the OpenLayer map plugin.
 */
import React from 'react'
import { getLayersFromLayersData, getTileLayer } from 'app/components/pages/map/olHelpers'
import { getFeatureByName, getFeatureColor, getFilteredFeatures } from 'app/components/pages/map/umapDataSelectors'
import debounce from 'app/helpers/debounce'
import * as map from 'app/reducers/map'
import { connect } from 'react-redux'
const geojsonExtent = require('geojson-extent')
const geoViewport = require('@mapbox/geo-viewport')

/**
 * Props :
 * registerSelectFeature
 * umapData data to display in the map
 * filter   text filter
 * setFeature to set a selected feature
 * ol       openlayer lib
 */
class OLMap extends React.PureComponent {

  constructor() {
    super()

    this.state = {
      mapContainer : null,
      map          : null,
      selection    : null,
    }
    this.initialized = false
    this.setMapContainer = this.setMapContainer.bind(this)
    this.updateMap = debounce(this.updateMap.bind(this), 250)
    this.selectFeature = this.selectFeature.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.umapData !== this.props.umapData
      || prevProps.filter !== this.props.filter
      || prevProps.ol !== this.props.ol
      || prevState.mapContainer !== this.state.mapContainer) {
      this.updateMap()
    }
    if (prevProps.selectedFeature !== this.props.selectedFeature || !this.initialized) {
      this.selectFeature(getFeatureByName(this.props.umapData.layers, this.props.selectedFeature))
      this.initialized = (this.state.map != null)
    }
  }

  selectFeature(feature) {
    if (this.state.map === null) return
    let properties = null
    if (feature != null) {
      properties = feature.properties
    }

    this.setState({
      selection : properties
    }, () => {
      if (this.state.selection === null) return
      const view = this.state.map.getView()
      if (this.state.selection != null) {
        const coords = ol.proj.fromLonLat(feature.geometry.coordinates)
        view.animate({ center : coords, duration : 150, zoom : view.getZoom() })

        const overlay = this.state.map.getOverlays().getArray()[0]
        if (overlay != null) {
          overlay.setPosition(coords)
        }
      }
    })
  }

  updateMap() {
    const { mapContainer } = this.state
    const { umapData, ol, popupContainer } = this.props

    if (mapContainer === null || umapData === null || ol === null) return

    try {

      let map = this.state.map
      if (this.state.map !== null) {} else {

        const mapOptions = {
          target : mapContainer,
          view   : new ol.View({
            center : ol.proj.fromLonLat(umapData.geometry.coordinates),
            zoom   : umapData.properties.zoom
          })
        }
        if (popupContainer != null) {
          mapOptions.overlays = [new ol.Overlay(({
            element : popupContainer,
          }))]
        }

        map = new ol.Map(mapOptions);
        map.on('click', evt => {
          const feature = map.forEachFeatureAtPixel(evt.pixel, f => f);
          this.props.setFeature(feature ? feature.getProperties().properties.name : null)
        });
        map.on('pointermove', e => {
          const pixel = map.getEventPixel(e.originalEvent);
          const hit = map.hasFeatureAtPixel(pixel);
          map.getTarget().style.cursor = hit ? 'pointer' : '';
        });
        this.setState({
          map
        })
      }

      map.getLayers().clear()
      map.addLayer(getTileLayer(umapData.properties.tilelayer.url_template, ol))
      getLayersFromLayersData(umapData.layers, this.props.filter).forEach(layer => {
        map.addLayer(layer)
      })
      map.render()

      const coordinates = getFilteredFeatures(umapData.layers, this.props.filter).map(f => f.geometry.coordinates)
      if (coordinates.length > 1) {
        let boundingExtent = ol.extent.boundingExtent(coordinates);
        boundingExtent = ol.proj.transformExtent(boundingExtent, ol.proj.get('EPSG:4326'), ol.proj.get('EPSG:3857'));
        map.getView().fit(boundingExtent, { size : map.getSize(), duration : 150 });
      }

    } catch (e) {
      throw new Error(e, 'Error while reading umap data')
    }
  }

  setMapContainer(container) {
    if (container !== null) {
      this.setState({
        mapContainer : container
      })
    }
    else if (this.map !== null) {
      this.map = null
    }
  }

  render() {

    let content = null
    const { umapData, filter, hasServerInteractions } = this.props

    let mapURL = 'assets/mapPlaceholder.png'
    if (hasServerInteractions && filter !== '') {
      // move token server side (and libs geojsonExtent and geoViewport as well)
      const token = 'pk.eyJ1IjoibHl0aG9tIiwiYSI6ImNqMmhpcWVnZzAwMWcycm12Y3BuejZvbmgifQ.SQ9hbbYWNplFR0CzAaz79g'
      const size = [720, 576]
      const features = getFilteredFeatures(umapData.layers, filter)
      const bounds = geojsonExtent({
        "type" : "FeatureCollection",
        features
      })
      const viewport = geoViewport.viewport(bounds, size)
      const zoom = features.length === 1 ? 16 : viewport.zoom - 1
      const pins = features.map(f => (
        `pin-s+${getFeatureColor(umapData.layers, f.properties.name).substring(1)}(${f.geometry.coordinates.join(',')})`
      ))
      mapURL = `https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/${pins.join(',')}/${viewport.center.join(',')},${zoom}/${size.join('x')}?access_token=${token}`
    }

    return (
      <div className={this.props.className} ref={this.setMapContainer}>
        <img className={`pos-a ${this.state.mapContainer ? 'op-03' : ''} l-0 t-0`} src={mapURL} height="auto"/>
      </div>
    )
  }
}


function mapStateToProps(state, ownProps) {
  return {
    filter          : map.selectors.getFilter(state.map),
    selectedFeature : map.selectors.getSelectedFeature(state.map, ownProps.umapData.layers),
  }
}

export default connect(mapStateToProps)(OLMap)