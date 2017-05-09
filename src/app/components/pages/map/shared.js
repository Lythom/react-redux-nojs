export function filterFeature(feature, filter) {
  return filter === ''
    || (feature.properties.name && feature.properties.name.toLowerCase().indexOf(filter.toLowerCase()) > -1)
    || (feature.properties.street && feature.properties.street.toLowerCase().indexOf(filter.toLowerCase()) > -1)
}