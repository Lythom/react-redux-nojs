import { filterFeature } from 'app/components/pages/map/umapDataSelectors'

export function getLayersFromLayersData(layersData, filter) {
  return layersData.map(layer => (
    new ol.layer.Vector({
      style  : getLayerStyle(layer),
      source : new ol.source.Vector({
        features : [
          ...layer.features.filter(f => filterFeature(f, filter)).map(feature => new ol.Feature({
            geometry   : new ol.geom.Point(ol.proj.fromLonLat(feature.geometry.coordinates)),
            properties : feature.properties,
          }))
        ]
      })
    })
  ))
}

let TILE_LAYER = null
export function getTileLayer(url, ol = null) {
  if (TILE_LAYER !== null) return TILE_LAYER
  if (!ol) return null
  TILE_LAYER = new ol.layer.Tile({
    source : new ol.source.OSM({
      url : url,
    })
  })
  return TILE_LAYER
}

export function getLayerStyle(layer) {
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