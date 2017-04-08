import { combineReducers } from 'redux'
import counter from './counter'
import interactions from './interactions'

export default combineReducers({
  counter,
  interactions
})