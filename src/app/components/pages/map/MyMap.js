/**
 * Display a dynamic map.
 * * Dynamic interactions : ✔ allowed
 * * Server interactions  : ✔ allowed
 * * Static interactions  : ✘ disabled
 */
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as interactions from 'app/reducers/interactions'
import MapList from 'app/components/pages/map/MapList'
import OLMap from 'app/components/pages/map/OLMap'
import withData from 'app/components/hoc/withData'
import { getFilteredFeatures } from 'app/components/pages/map/shared'
import * as map from 'app/reducers/map'

class MyMap extends React.PureComponent {

  constructor() {
    super()
    this.setFilter = this.setFilter.bind(this)
  }

  setFilter(e) {
    this.props.setFilter(e.target.value)
    const features = getFilteredFeatures(this.props.data.layers, e.target.value)
    if (features.length === 1) {
      this.props.setSelectedFeature(features[0].properties.name)
    }
    else {
      this.props.setSelectedFeature(null)
    }
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
          <input id="filter" value={this.props.filter} onChange={this.setFilter}/>
        </label>
      </div>

      <OLMap className="d-ib col-9 h-24 maw-100p" umapData={umapData} filter={this.props.filter} ol={this.props.ol} setFeature={this.props.setSelectedFeature} />

      <div className="d-ib col-3 h-5 va-t ta-l p-1">
        <div>
          <span className="h-2">Listes :</span>
          <MapList layers={umapData == null ? null : umapData.layers} filter={this.props.filter} setFeature={this.props.setSelectedFeature} />
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
    filter                : map.selectors.getFilter(state.map),
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setFilter : map.actions.setFilter,
    setSelectedFeature: map.actions.setSelectedFeature,
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withData('/assets/map.umap')(MyMap))
