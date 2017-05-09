import React from 'react'

export default ({ layers, selectFeature }) => (
  <div>
    <span className="h-2">Listes :</span>
    {layers && layers.length > 0 && (
      <ul className="list-unstyled h-22 ov-a">
        {layers.map(layer => (
          <li key={layer._storage.name}>
            <div className="d-ib ta-c va-m" style={{ backgroundColor : layer._storage.color, width : 32, height : 32, lineHeight : '2.7rem' }}>
              <img src={`/assets/icons/${layer._storage.name}.png`} width="24" height="24"/>
            </div>
            <span className="va-m"> {layer._storage.name}</span>
            <ul className="list-unstyled fs-small">
              {layer.features.map(feature => (
                <li key={feature.properties.name}>
                  <button className="btn ta-l p-1" onClick={e => selectFeature(feature)}>
                    {feature.properties.name}<br/>
                    {feature.properties.street} - {feature.properties.city}
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    )}
  </div>
)
