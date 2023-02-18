import React from 'react'

import { NavDropdown } from './menu-components'
import { MenuItem } from './menu-item'

const adminMenuItems = (
  <>
    <MenuItem icon="users" to="/admin/user-management">
      Gestion des utilisateurs
    </MenuItem>
  </>
)

const openAPIItem = (
  <MenuItem icon="book" to="/admin/docs">
    API
  </MenuItem>
)

export const AdminMenu = ({ showOpenAPI }) => (
  <NavDropdown icon="users-cog" name="Administration" id="admin-menu" data-cy="adminMenu">
    {adminMenuItems}
    {showOpenAPI && openAPIItem}
  </NavDropdown>
)
