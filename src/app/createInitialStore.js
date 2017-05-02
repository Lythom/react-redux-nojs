import { createStore } from 'redux'
import rootReducer from 'app/reducers/index'
import * as counter from 'app/reducers/counter'

export default (initialState) => {
  const store = createStore(rootReducer, initialState)

  // initialize a counter store the first time.
  if (!counter.selectors.isInitialized(store.getState().counter)) {
    store.dispatch(counter.actions.initCounterStart())
  }

  if(module.hot) {
    module.hot.accept('app/reducers/index', () =>
      store.replaceReducer(require('app/reducers/index').default)
    );
  }

  return store
}