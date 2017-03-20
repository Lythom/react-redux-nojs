const React = require('react')

module.exports = React.createClass({

  getInitialState() {
    return {
      dynamic: 'static'
    }
  },

  componentDidMount() {
    this.setState({
      dynamic: 'dynamic'
    })
  },

  render() {
    return React.createElement('div', null, `I'm server rendered with react ! with ${this.state.dynamic} interactions !`)
  }
})