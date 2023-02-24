import { Button, Menu, MenuButton, MenuList } from '@chakra-ui/react'
import React from 'react'
import { FaUsersCog } from 'react-icons/fa'
import { GoTriangleDown } from 'react-icons/go'

import { MenuItem } from './menu-item'

const adminMenuItems = (
  <>
    <MenuItem icon="users" to="/admin/user-management">
      Gestion des utilisateurs
    </MenuItem>
  </>
)

const openAPIItem = (
  <MenuItem icon="book" to=":8080/docs">
    API
  </MenuItem>
)

export const AdminMenu = ({ showOpenAPI }) => (
  <Menu>
    <MenuButton
      variant="menu"
      as={Button}
      aria-label="Options"
      leftIcon={<FaUsersCog />}
      rightIcon={<GoTriangleDown />}
    >
      Compte
    </MenuButton>
    <MenuList>{adminMenuItems} {showOpenAPI && openAPIItem}</MenuList>
  </Menu>
)
