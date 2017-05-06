/**
 * Page layout for the Map
 */
import React from 'react'
import withTitle from 'app/components/hoc/withTitle'
import MyMap from 'app/components/pages/map/MyMap'
import { Helmet } from 'react-helmet'


class MapPage extends React.PureComponent {

  constructor() {
    super()
    this.state = {
      openLayerLibrary : MapPage.openLayerLibrary
    }
  }

  componentDidMount() {
    if (this.state.openLayerLibrary === null) {
      whenAvailable('ol').then((ol) => {
        MapPage.openLayerLibrary = ol
        this.setState({ openLayerLibrary : ol })
      })
    }
  }

  render() {
    return <div>
      <Helmet>
        <link rel="stylesheet" href="https://openlayers.org/en/v4.1.1/css/ol.css" type="text/css"/>
        <script defer src="https://openlayers.org/en/v4.1.1/build/ol.js" type="text/javascript"/>
      </Helmet>
      <MyMap ol={this.state.openLayerLibrary} />
    </div>

  }
}

MapPage.openLayerLibrary = null

export default withTitle('My favorites places')(MapPage)

function whenAvailable(name) {
  const retryFor = 5000 // ms
  const retryTimer = 100 // ms
  let retryCountdown = Math.ceil(retryFor / retryTimer)
  return new Promise((resolve, reject) => {
    const interval = setInterval(function() {
      if (window[name]) {
        clearInterval(interval)
        resolve(window[name])
      }
      if (retryCountdown === 0) {
        clearInterval(interval)
        reject(`Could not find ${name} after ${retryFor} seconds.`)
      }
      retryCountdown -= 1
    }, retryTimer);
  })
}