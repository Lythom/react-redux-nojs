import React from 'react'
import Menu, { MenuItem } from 'app/components/layout/Menu'

const Layout = ({children}) => (
  <div>
    <div className="fl-l mr-10">
      <img src="/assets/SB_logo.png" alt="Samuel Bouchet" width={150} height={75} />
    </div>
    <Menu>
      <MenuItem to="/index.html">Home</MenuItem>
      <MenuItem to="/demo.html">Demo Counter</MenuItem>
      <MenuItem to="/map.html">Carte géographique</MenuItem>
    </Menu>
    <hr />
    {children}
  </div>
)
export default Layout