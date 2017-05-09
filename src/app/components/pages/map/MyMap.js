/**
 * Display a dynamic map.
 * * Dynamic interactions : ✔ allowed
 * * Server interactions  : ✔ allowed
 * * Static interactions  : ✘ disabled
 */
import React from 'react'
import { connect } from 'react-redux'
import * as interactions from 'app/reducers/interactions'
import MapList from 'app/components/pages/map/MapList'
import OLMap from 'app/components/pages/map/OLMap'

class MyMap extends React.PureComponent {

  constructor() {
    super()

    this.state = {
      umapData     : MyMap.umapData,
      filter       : '',
    }

    this.setFilter = this.setFilter.bind(this)
    this.selectFeature = this.selectFeature.bind(this)
  }

  componentDidMount() {
    if (this.state.umapData === null) {
      fetch('/assets/map.umap')
        .then(response => response.json())
        .then(json => {
          MyMap.umapData = json
          this.setState({
            umapData : json
          })
        })
        .catch(err => {
          console.error(err)
        })
    }
  }

  setFilter(e) {
    this.setState({ filter : e.target.value })
  }

  selectFeature(feature) {
    this.setState({ filter : feature === null ? '' : feature.properties.name })
  }

  render() {

    let content = null
    const { umapData } = this.state

    if (this.props.hasStaticInteractions) {
      content = 'Static image from the server (TODO)'
    } else if (this.props.hasServerInteractions || this.mapContainer === null) {
      content = 'Dynamic image from the server (TODO)'
    } else {
      content = 'Dynamic map clientside (loading)'
    }
    return <div className="ta-c">
      <div>{this.state.map === null && content}</div>
      <div className="m-auto ta-c m-1">
        <label htmlFor="filter">
          <span>Rechercher :</span>
          <input id="filter" value={this.state.filter} onChange={this.setFilter}/>
        </label>
      </div>

      <OLMap umapData={umapData} filter={this.state.filter} ol={this.props.ol} selectFeature={this.selectFeature} />

      <div className="d-ib col-3 h-5 va-t ta-l p-1">
        <MapList layers={umapData && umapData.layers} selectFeature={this.selectFeature} />
      </div>
    </div>

  }
}

MyMap.umapData = null

function mapStateToProps(state) {
  return {
    hasStaticInteractions : interactions.selectors.isStatic(state.interactions),
    hasServerInteractions : interactions.selectors.isServer(state.interactions),
  }
}

export default connect(mapStateToProps)(MyMap)
