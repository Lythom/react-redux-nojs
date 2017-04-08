export default function interactions(state = null, action) {
  switch (action.type) {
    case 'SET_INTERACTIONS':
      return action.payload
    default:
      return state
  }
}

export const actions = {
  setStatic : () => ({ type : 'SET_INTERACTIONS', payload : 'static' }),
  setServer : () => ({ type : 'SET_INTERACTIONS', payload : 'server' }),
  setDynamic : () => ({ type : 'SET_INTERACTIONS', payload : 'dynamic' })
}

export const selectors = {
  isStatic(state) {
    return state === 'static'
  },
  getInteractions(state) {
    return state
  }
}
