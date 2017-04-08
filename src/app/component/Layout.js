import React from 'react'
import Menu, {MenuItem} from 'app/component/Menu'

const Layout = ({children}) => (
  <div>
    <Menu>
      <MenuItem to="/index.html">Home</MenuItem>
      <MenuItem to="/demo.html">Demo Counter</MenuItem>
    </Menu>
    <hr />
    {children}
  </div>
)
export default Layout