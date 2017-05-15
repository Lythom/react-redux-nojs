const geojsonExtent = require('geojson-extent')
const geoViewport = require('@mapbox/geo-viewport')
import { getFeatureColor, getFilteredFeatures } from 'app/components/pages/map/umapDataSelectors'


export default function generateStaticMapURL(layers, filter) {
  // move token server side (and libs geojsonExtent and geoViewport as well)
  const token = 'pk.eyJ1IjoibHl0aG9tIiwiYSI6ImNqMmhpcWVnZzAwMWcycm12Y3BuejZvbmgifQ.SQ9hbbYWNplFR0CzAaz79g'
  const size = [720, 576]
  const features = getFilteredFeatures(layers, filter)
  const bounds = geojsonExtent({
    "type" : "FeatureCollection",
    features
  })
  const viewport = geoViewport.viewport(bounds, size)
  const zoom = features.length === 1 ? 16 : viewport.zoom - 1
  const pins = features.map(f => (
    `pin-s+${getFeatureColor(layers, f.properties.name).substring(1)}(${f.geometry.coordinates.join(',')})`
  ))
  return  `https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/${pins.join(',')}/${viewport.center.join(',')},${zoom}/${size.join('x')}?access_token=${token}`
}
