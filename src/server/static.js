import createAppRenderer from './createAppRenderer'
import createInitialStore from 'app/createInitialStore'
import * as interactions from 'app/reducers/interactions'

/**
 * For static rendering.
 * see https://github.com/markdalgleish/static-site-generator-webpack-plugin
 * @param locals
 */
export default function render(locals) {
  const store = createInitialStore()
  store.dispatch(interactions.actions.setStatic())
  const render = createAppRenderer(locals.path, store)
  return render()
}