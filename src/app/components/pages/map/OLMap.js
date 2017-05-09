import React from 'react'

/**
 * Encapsulate the OpenLayer map plugin.
 */
class OLMap extends React.PureComponent {

  constructor() {
    super()

    this.state = {
      mapContainer : null,
      map          : null,
    }
    this.setMapContainer = this.setMapContainer.bind(this)
    this.filterFeature = this.filterFeature.bind(this)
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

  filterFeature(feature) {
    return this.props.filter === ''
      || (feature.properties.name && feature.properties.name.toLowerCase().indexOf(this.props.filter.toLowerCase()) > -1)
      || (feature.properties.street && feature.properties.street.toLowerCase().indexOf(this.props.filter.toLowerCase()) > -1)
  }

  updateMap() {
    const { mapContainer } = this.state
    const { umapData, ol, selectFeature } = this.props

    if (mapContainer === null || umapData === null || ol === null) return

    try {

      const layersData = umapData.layers.map(layer => (
        new ol.layer.Vector({
          style  : getLayerStyle(layer),
          source : new ol.source.Vector({
            features : [
              ...layer.features.filter(this.filterFeature).map(feature => new ol.Feature({
                geometry : new ol.geom.Point(ol.proj.fromLonLat(feature.geometry.coordinates)),
                properties: feature.properties,
              }))
            ]
          })
        })
      ))

      if (this.state.map !== null) {
        this.state.map.getLayers().clear()
        this.state.map.addLayer(getTileLayer(umapData.properties.tilelayer.url_template, ol))
        layersData.forEach(layer => {
          this.state.map.addLayer(layer)
        })
        this.state.map.render()

      } else {
        const mapOptions = {
          target : mapContainer,
          layers : [
            getTileLayer(umapData.properties.tilelayer.url_template, ol),
            ...layersData
          ],
          view   : new ol.View({
            center : ol.proj.fromLonLat(umapData.geometry.coordinates),
            zoom   : umapData.properties.zoom
          })
        }
        const map = new ol.Map(mapOptions);
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

    return <div className="d-ib col-9 h-24 maw-100p" ref={this.setMapContainer}/>
  }
}


export default OLMap


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