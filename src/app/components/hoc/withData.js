import React from 'react'

const cachedData = {}

export default dataSource => WrappedComponent => {
  const WrappedWithData = class withData extends React.PureComponent {

    constructor() {
      super()
      this.state = {
        data : cachedData[dataSource],
      }
    }

    componentDidMount() {
      if (this.state.data === undefined) {
        fetch(dataSource)
          .then(response => response.json())
          .then(json => {
            cachedData[dataSource] = json
            this.setState({
              data : json
            })
          })
          .catch(err => {
            console.error(err)
          })
      }
    }

    render() {
      return <WrappedComponent data={this.state.data} {...this.props} />
    }
  }

  WrappedWithData.displayName = `withData(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return WrappedWithData
}

