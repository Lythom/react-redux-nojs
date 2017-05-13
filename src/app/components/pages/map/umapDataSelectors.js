export function getFilteredFeatures(layersData, filter) {
  const allFeatures = [].concat(...layersData.map(l => l.features))
  const features = allFeatures.filter(f => filterFeature(f, filter))
  return features.length > 0 ? features : allFeatures
}
export function getFeatureByName(layersData, featureName) {
  if (featureName == null) return null
  const allFeatures = [].concat(...layersData.map(l => l.features))
  const features = allFeatures.filter(f => filterFeature(f, featureName))

  return features.length > 0 ? features[0] : null
}

export function getFeatureColor(layersData, featureName) {
  if (featureName == null) return null
  const layer = layersData.find(layer => layer.features.some(f => filterFeature(f, featureName)))
  return layer ? layer._storage.color : null
}

export function filterFeature(feature, filter) {
  return filter === ''
    || (feature.properties.name && feature.properties.name.toLowerCase().indexOf(filter.toLowerCase()) > -1)
    || (feature.properties.street && feature.properties.street.toLowerCase().indexOf(filter.toLowerCase()) > -1)
}
