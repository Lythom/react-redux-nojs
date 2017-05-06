import * as React from 'react'
import { Helmet } from 'react-helmet'

export default title => Component => ({ props }) => (
  <div>
    <Helmet>
      <title>{`Samuel Bouchet - ${title}`}</title>
    </Helmet>
    <h2>{title}</h2>
    <Component {...props} />
  </div>
)