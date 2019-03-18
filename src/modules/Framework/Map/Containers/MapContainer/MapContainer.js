import React, { Component, PropTypes } from 'react'
import { divIcon } from 'leaflet'
import { Map, Tooltip, Popup, Marker, TileLayer } from 'react-leaflet'

const icon = divIcon({
  className: 'myleaflet-marker-icon',
  iconSize: [50, 68]
})

import './MapContainer.scss'

export class MapContainer extends Component {
  static propTypes = {
    marker: PropTypes.bool
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { position, zoom = 12, zoomControl = true } = this.props
    const { marker } = this.props

    // TODO: add markers
    return (
      <div className="map-container">
        <Map center={position} zoom={zoom} style={{ width: 300, height: 300 }}>
          <TileLayer
            attribution="&copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />

          {marker ? <Marker icon={icon} position={position} /> : null}
        </Map>
      </div>
    )
  }
}

export default MapContainer
