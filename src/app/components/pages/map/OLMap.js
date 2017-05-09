/**
 * Encapsulate the OpenLayer map plugin.
 */
import React from 'react'
import { filterFeature } from 'app/components/pages/map/shared'

class OLMap extends React.PureComponent {

  constructor() {
    super()

    this.state = {
      mapContainer : null,
      map          : null,
    }
    this.setMapContainer = this.setMapContainer.bind(this)
    this.updateMap = this.updateMap.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.umapData !== this.props.umapData
      || prevProps.filter !== this.props.filter
      || prevProps.ol !== this.props.ol
      || prevState.mapContainer !== this.state.mapContainer) {
      this.updateMap()
    }
  }

  updateMap() {
    const { mapContainer } = this.state
    const { umapData, ol, selectFeature } = this.props

    if (mapContainer === null || umapData === null || ol === null) return

    try {

      let map = this.state.map
      if (this.state.map === null) {
        const mapOptions = {
          target : mapContainer,
          view   : new ol.View({
            center : ol.proj.fromLonLat(umapData.geometry.coordinates),
            zoom   : umapData.properties.zoom
          })
        }
        map = new ol.Map(mapOptions);
        map.on('click', function(evt) {
          const feature = map.forEachFeatureAtPixel(evt.pixel, f => f);
          if (selectFeature !== undefined) selectFeature(feature === undefined ? null : feature.getProperties())
        });
        map.on('pointermove', function(e) {
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
    const { umapData } = this.props

    return <div className={this.props.className} ref={this.setMapContainer}/>
  }
}


export default OLMap

function getLayersFromLayersData(layersData, filter) {
  return layersData.map(layer => (
    new ol.layer.Vector({
      style  : getLayerStyle(layer),
      source : new ol.source.Vector({
        features : [
          ...layer.features.filter(f => filterFeature(f, filter)).map(feature => new ol.Feature({
            geometry : new ol.geom.Point(ol.proj.fromLonLat(feature.geometry.coordinates)),
            properties: feature.properties,
          }))
        ]
      })
    })
  ))
}

let TILE_LAYER = null
function getTileLayer(url, ol = null) {
  if (TILE_LAYER !== null) return TILE_LAYER
  if (!ol) return null
  TILE_LAYER = new ol.layer.Tile({
    source : new ol.source.OSM({
      url : url,
    })
  })
  return TILE_LAYER
}

function getLayerStyle(layer) {
  return [
    // background
    new ol.style.Style({
      // image: layer.iconUrl
      image : new ol.style.Icon({
        anchor : [0.5, 0.96],
        color  : layer._storage.color || umapData.properties.color,
        src    : '/assets/marker.png'
      })
    }),
    //foreground icon
    new ol.style.Style({
      // image: layer.iconUrl
      image : new ol.style.Icon({
        anchor : [0.5, 1.7],
        color  : 'white',
        src    : `/assets/icons/${layer._storage.name}.png`
      })
    })
  ]
}