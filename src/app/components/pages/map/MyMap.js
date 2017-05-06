import React from 'react'
import { connect } from 'react-redux'
import * as interactions from 'app/reducers/interactions'

/**
 * Display a dynamic map.
 * * Dynamic interactions : ✔ allowed
 * * Server interactions  : ✔ allowed
 * * Static interactions  : ✘ disabled
 */
class MyMap extends React.PureComponent {

  constructor() {
    super()

    this.state = {
      umapData     : MyMap.umapData,
      mapContainer : null,
      map          : null,
    }

    this.setMapContainer = this.setMapContainer.bind(this)
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

  componentDidUpdate(prevProps, prevState) {
    if (prevState.umapData !== this.state.umapData || prevState.mapContainer !== this.state.mapContainer || prevProps.ol !== this.props.ol) {
      this.updateMap()
    }
  }

  updateMap() {
    const { mapContainer, umapData } = this.state
    const ol = this.props.ol

    if (mapContainer === null || umapData === null || ol === null) return

    try {

      const layersData = umapData.layers.map(layer => (
        new ol.layer.Vector({
          style  : [
            // background
            new ol.style.Style({
              // image: layer.iconUrl
              image : new ol.style.Icon({
                anchor : [0.5, 0.96],
                color  : layer._storage.color || umapData.properties.color,
                src    : '/assets/marker.png'
              })
            }),
            //foreground icon
            new ol.style.Style({
              // image: layer.iconUrl
              image : new ol.style.Icon({
                anchor      : [0.5, 1.7],
                color       : 'white',
                src         : `/assets/icons/${layer._storage.name}.png`
              })
            })
          ],
          source : new ol.source.Vector({
            features : [
              ...layer.features.map(feature => new ol.Feature({
                geometry : new ol.geom.Point(ol.proj.fromLonLat(feature.geometry.coordinates))
              }))
            ]
          })
        })
      ))

      const mapOptions = {
        target : mapContainer,
        layers : [
          new ol.layer.Tile({
            source : new ol.source.OSM({
              url : umapData.properties.tilelayer.url_template
            })
          }),
          ...layersData
        ],
        view   : new ol.View({
          center : ol.proj.fromLonLat(umapData.geometry.coordinates),
          zoom   : umapData.properties.zoom
        })
      }
      const map = new ol.Map(mapOptions);

      this.setState({
        map
      })
    } catch (e) {
      throw new Error(e, 'Error while reading umap data')
    }
  }

  setMapContainer(container) {
    if (container !== null) {
      this.setState({
        mapContainer : container
      })
    }
    else if (this.map !== null) {
      this.map = null
    }
  }

  render() {

    let content = null

    if (this.props.hasStaticInteractions) {
      content = 'Static image from the server (TODO)'
    } else if (this.props.hasServerInteractions || this.mapContainer === null) {
      content = 'Dynamic image from the server (TODO)'
    } else {
      content = 'Dynamic map clientside (loading)'
    }
    return <div>
      <div>{this.state.map === null && content}</div>
      <div className="m-auto col-12 h-24 maw-100p" ref={this.setMapContainer}/>
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
