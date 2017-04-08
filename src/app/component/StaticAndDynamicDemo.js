import React from 'react'
import { connect } from 'react-redux'
import * as counter from 'app/reducers/counter'
import * as interactions from 'app/reducers/interactions'

const StaticAndDynamicDemo = React.createClass({

  displayName: 'StaticAndDynamicDemo',

  componentDidMount() {
    this.interval = setInterval(() => this.props.inc(), 1000)
  },

  componentWillUnmount() {
    clearInterval(this.interval)
  },

  render() {
    const intro = 'I\'m server rendered with react'
    if (this.props.isStatic) return <div>{intro}. Service is currently down, try again later !</div>
    return <div>{intro}. Counting: {this.props.count} (test reload number : 38) ! with {this.props.interactions} interactions !</div>
  }
})

function mapStateToProps(state) {
  return {
    count: counter.selectors.getCount(state.counter),
    isStatic: interactions.selectors.isStatic(state.interactions),
    interactions: interactions.selectors.getInteractions(state.interactions)
  }
}
function mapDispatchToProps(dispatch) {
  return {
    inc: () => dispatch(counter.actions.increment())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StaticAndDynamicDemo)