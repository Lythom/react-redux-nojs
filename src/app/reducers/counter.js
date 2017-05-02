export default function counter(state = -1, action) {
  switch (action.type) {
    case 'INIT_COUNTER':
      return action.payload
    default:
      return state
  }
}

export const actions = {
  initCounterStart : () => ({type: 'INIT_COUNTER', payload: Date.now()})
}

export const selectors = {
  getCounterStart(state) {
    return state
  },
  isInitialized(state) {
    return state !== -1
  }
}
