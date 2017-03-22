import React from 'react'
import { connect } from 'react-redux'
import * as counter from 'app/reducers/counter'

const StaticAndDynamicDemo = React.createClass({

  displayName: 'StaticAndDynamicDemo',

  getInitialState() {
    return {
      dynamic : 'static',
    }
  },

  componentDidMount() {
    this.setState({
      dynamic : 'dynamic'
    })
    this.interval = setInterval(() => this.props.inc(), 1000)
  },

  componentWillUnmount() {
    clearInterval(this.interval)
  },

  render() {
    return <div>I'm server rendered with react. Counting: {this.props.count} (test reload number : 37) ! with {this.state.dynamic} interactions !</div>
  }
})

function mapStateToProps(state) {
  return {
    count: counter.selectors.getCount(state.counter)
  }
}
function mapDispatchToProps(dispatch) {
  return {
    inc: () => dispatch(counter.actions.increment())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StaticAndDynamicDemo)