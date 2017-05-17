/**
 * For static rendering.
 * see https://github.com/markdalgleish/static-site-generator-webpack-plugin
 * @param locals
 */
import createAppRenderer from './createAppRenderer'
import createInitialStore from 'app/createInitialStore'
import * as interactions from 'app/reducers/interactions'
import { dataURL } from 'app/constants'
import umapData from 'app/assets/map.umap'
import { cachedData } from 'app/components/hoc/withData'


export default function render(locals) {
  const store = createInitialStore()
  store.dispatch(interactions.actions.setStatic())

  // hydrate data
  cachedData[dataURL.umapData] = umapData

  const render = createAppRenderer(locals.path, store, null, cachedData)
  return render()
}
