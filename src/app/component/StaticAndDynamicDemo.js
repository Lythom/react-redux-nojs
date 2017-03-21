import React from 'react'

export default React.createClass({

  displayName: 'StaticAndDynamicDemo',

  getInitialState() {
    return {
      dynamic : 'static',
      count   : 0,
    }
  },

  componentDidMount() {
    this.setState({
      dynamic : 'dynamic'
    })
    this.interval = setInterval(() => {
      this.setState({
        count : this.state.count + 1
      })
    }, 1000)
  },

  componentWillUnmount() {
    clearInterval(this.interval)
  },

  render() {
    return <div>I'm server rendered with react. Counting: {this.state.count} (test reload number : 25) ! with {this.state.dynamic} interactions !</div>
  }
})
