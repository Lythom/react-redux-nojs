import { combineReducers } from 'redux'
import counter from './counter'
import interactions from './interactions'
import map from 'app/reducers/map'

export default combineReducers({
  counter,
  interactions,
  map
})