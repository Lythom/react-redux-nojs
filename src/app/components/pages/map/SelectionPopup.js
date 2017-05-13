import React from 'react'
import { getFeatureByName, getFeatureColor } from 'app/components/pages/map/shared'
import * as map from 'app/reducers/map'
import { connect } from 'react-redux'

class SelectionPopup extends React.PureComponent {

  constructor() {
    super()

    this.state = {
      popupContainer : null,
      popupHeight    : null,
    }
    this.setPopupContainer = this.setPopupContainer.bind(this)
  }

  componentDidMount() {
    this.updateHeight()
  }

  componentDidUpdate(prevProps, prevState) {
    this.updateHeight()
  }

  updateHeight() {
    if (this.state.popupContainer) this.setState({ popupHeight : this.state.popupContainer.offsetHeight + 20 })
  }

  setPopupContainer(container) {
    this.setState({
      popupContainer : container
    })
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
             top         : this.state.popupHeight != null ? -this.state.popupHeight - 22 : null,
             bottom      : this.state.popupHeight != null ? null : `calc(50% + 44px)`,
             width       : 320,
             borderColor : color
           }}>
        <strong>{selection && selection.name}</strong>
        <div>{selection && selection.description}</div>
      </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    selectedFeature : map.selectors.getSelectedFeature(state.map),
  }
}

export default connect(mapStateToProps)(SelectionPopup)