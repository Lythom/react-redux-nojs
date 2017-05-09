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
import withData from 'app/components/hoc/withData'

class MyMap extends React.PureComponent {

  constructor() {
    super()

    this.state = {
      filter : '',
    }

    this.setFilter = this.setFilter.bind(this)
    this.selectFeature = this.selectFeature.bind(this)
  }

  setFilter(e) {
    this.setState({ filter : e.target.value })
  }

  selectFeature(feature) {
    this.setState({ filter : feature === null ? '' : feature.properties.name })
  }

  render() {

    let content = null
    const umapData = this.props.data

    if (this.props.hasStaticInteractions) {
      content = 'Static image from the server (TODO)'
    } else if (this.props.hasServerInteractions || this.mapContainer === null) {
      content = 'Dynamic image from the server (TODO)'
    } else {
      content = 'Dynamic map clientside'
    }
    return <div className="ta-c">
      <div className="ta-c m-1">
        <label htmlFor="filter">
          <span>Rechercher :</span>
          <input id="filter" value={this.state.filter} onChange={this.setFilter}/>
        </label>
      </div>

      <OLMap className="d-ib col-9 h-24 maw-100p" umapData={umapData} filter={this.state.filter} ol={this.props.ol} selectFeature={this.selectFeature}/>

      <div className="d-ib col-3 h-5 va-t ta-l p-1">
        <div>
          <span className="h-2">Listes :</span>
          <MapList layers={umapData == null ? null : umapData.layers} filter={this.state.filter} selectFeature={this.selectFeature}/>
        </div>
      </div>
      <div>{content}</div>
    </div>

  }
}
MyMap.displayName = 'MyMap'

function mapStateToProps(state) {
  return {
    hasStaticInteractions : interactions.selectors.isStatic(state.interactions),
    hasServerInteractions : interactions.selectors.isServer(state.interactions),
  }
}

export default connect(mapStateToProps)(withData('/assets/map.umap')(MyMap))
