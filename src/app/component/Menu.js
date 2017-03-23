import React from 'react'
import { Link } from 'react-router-dom'
const Menu = ({ children }) => (
  <ul>
    {children}
  </ul>
)
export default Menu

export const MenuItem = ({ children, to }) => (
  <li className="d-ibl g-10"><Link to={to}>{children}</Link></li>
)
