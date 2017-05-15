import React from 'react'
import getAbsoluteURL from 'app/helpers/getAbsoluteURL'

export const cachedData = typeof(window) !== 'undefined' ? window.__CACHED_DATA__ : {}

export function loadJsonData(key, url) {
  return fetch(url)
    .then(response => response.json())
    .then(json => {
      cachedData[key] = json
      return json
    })
    .catch(err => {
      console.error(err)
    })
}

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
        loadJsonData(dataSource, getAbsoluteURL(dataSource, document)).then(json => {
          this.setState({
            data : json
          })
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

