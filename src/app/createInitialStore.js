import { createStore } from 'redux'
import rootReducer from 'app/reducers/index'

export default (initialState) => {
  const store = createStore(rootReducer, initialState)

  if(module.hot) {
    module.hot.accept('app/reducers/index', () =>
      store.replaceReducer(require('app/reducers/index').default)
    );
  }

  return store
}