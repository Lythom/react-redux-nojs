import { createStore } from 'redux'
import counter from 'app/reducers/index'

export default (initialState) => {
  const store = createStore(counter, initialState)

  if(module.hot) {
    module.hot.accept('app/reducers/index', () =>
      store.replaceReducer(require('app/reducers/index').default)
    );
  }

  return store
}