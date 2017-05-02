import React from 'react'
import { connect } from 'react-redux'
import * as counter from 'app/reducers/counter'
import * as interactions from 'app/reducers/interactions'

/**
 * Display a dynamic counter.
 * * Dynamic interactions : ✔ allowed
 * * Server interactions  : ✔ allowed
 * * Static interactions  : ✘ disabled
 */
class StaticAndDynamicDemo extends React.PureComponent {

  displayName: 'StaticAndDynamicDemo'

  componentDidMount() {
    this.interval = setInterval(this.forceUpdate.bind(this), 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    const intro = 'I\'m server rendered with react'
    if (this.props.hasStaticInteractions) return <div>{intro}. Service is currently down, try again later !</div>

    const count = this.props.isCounterInitialized ? Math.floor((Date.now() - this.props.counterStart) / 1000) : ''
    return <div>
      {intro}. Counting: {count} (test reload number : 39) {this.props.hasServerInteractions === true && <Reload />} ! with {this.props.interactions} interactions !
    </div>
  }
}

function mapStateToProps(state) {
  return {
    counterStart          : counter.selectors.getCounterStart(state.counter),
    isCounterInitialized  : counter.selectors.isInitialized(state.counter),
    hasStaticInteractions : interactions.selectors.isStatic(state.interactions),
    hasServerInteractions : interactions.selectors.isServer(state.interactions),
    interactions          : interactions.selectors.getInteractions(state.interactions)
  }
}

export default connect(mapStateToProps)(StaticAndDynamicDemo)


/**
 * Reload link.
 * Local component.
 */
const Reload = ({}) => <a href="">Reload</a>
