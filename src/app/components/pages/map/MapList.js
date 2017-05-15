import React from 'react'
import { filterFeature } from 'app/components/pages/map/umapDataSelectors'

export default ({ layers, filter, setFeature }) => {
  if (layers == null || layers.length === 0) return null
  return (
    <ul className="list-unstyled h-22 ov-a">
      {layers.map(layer => {
        const features = layer.features.filter(f => filterFeature(f, filter))
        if (features.length === 0) return null
        return (
          <li key={layer._storage.name}>
            <div className="d-ib ta-c va-m" style={{ backgroundColor : layer._storage.color, width : 32, height : 32, lineHeight : '2.7rem' }}>
              <img src={`/assets/icons/${layer._storage.name}.png`} width="24" height="24"/>
            </div>
            <span className="va-m"> {layer._storage.name}</span>
            <ul className="list-unstyled fs-small">
              {features.map(feature => (
                <li key={feature.properties.name}>
                  <form method="GET" action="">
                    <button type="submit" name="filter" value={feature.properties.name} className="btn ta-l p-1" onClick={e => {
                      e.preventDefault();
                      setFeature(feature.properties.name)
                    }}>
                      {feature.properties.name}<br/>
                      {feature.properties.street} - {feature.properties.city}
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          </li>
        )
      })}
    </ul>
  )
}
