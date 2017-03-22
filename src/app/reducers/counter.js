export default function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    default:
      return state
  }
}

export const actions = {
  increment : () => ({type: 'INCREMENT'})
}

export const selectors = {
  getCount(state) {
    return state
  }
}
