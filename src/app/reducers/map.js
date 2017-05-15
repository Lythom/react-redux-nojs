import { getFilteredFeatures } from 'app/components/pages/map/umapDataSelectors'
const initialState = {
  filter: '',
  selectedFeature: null,
}

export default function counter(state = initialState, action) {
  switch (action.type) {
    case 'SET_FILTER':
      if (state.filter === action.payload) return state
      return Object.assign({}, state, {
        filter : action.payload,
      })
    case 'SET_SELECTED_FEATURE':
      if (state.selectedFeature === action.payload) return state
      return Object.assign({}, state, {
        selectedFeature : action.payload,
      })
    default:
      return state
  }
}

export const actions = {
  setFilter          : (filterValue) => ({ type : 'SET_FILTER', payload : filterValue }),
  setSelectedFeature : (featureName) => ({ type : 'SET_SELECTED_FEATURE', payload : featureName }),
}

export const selectors = {
  getFilter(state) {
    return state.filter
  },
  getSelectedFeature(state, layers = null) {
    if (state.selectedFeature || layers === null) return state.selectedFeature
      const features = getFilteredFeatures(layers, state.filter)
      if (features.length === 1) {
        return features[0].properties.name
      }
      return null
  },
}
