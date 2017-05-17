import React from 'react'
import { getFeatureByName, getFeatureColor } from 'app/components/pages/map/umapDataSelectors'
import * as map from 'app/reducers/map'
import { connect } from 'react-redux'
import * as interactions from 'app/reducers/interactions'

class SelectionPopup extends React.PureComponent {

  constructor() {
    super()
    this.setPopupContainer = this.setPopupContainer.bind(this)
  }

  setPopupContainer(container) {
    if (this.props.registerPopupContainer) this.props.registerPopupContainer(container)
  }

  render() {
    let selection = getFeatureByName(this.props.layers, this.props.selectedFeature)
    if (selection != null) selection = selection.properties
    const color = getFeatureColor(this.props.layers, this.props.selectedFeature)

    return (
      <div className="pos-a bgc-1 p-1 bd-2" ref={this.setPopupContainer}
           style={{
             display     : selection != null ? 'block' : 'none',
             left        : `calc(50% - 160px)`,
             bottom      : this.props.isDynamic ? 42 : `calc(50% + 44px)`,
             width       : 320,
             borderColor : color
           }}>
        <strong>{selection && selection.name}</strong>
        <div>{selection && selection.description}</div>
      </div>
    )
  }
}


function mapStateToProps(state, ownProps) {
  return {
    selectedFeature : map.selectors.getSelectedFeature(state.map, ownProps.layers),
    isDynamic: interactions.selectors.isDynamic(state.interactions),
  }
}

export default connect(mapStateToProps)(SelectionPopup)