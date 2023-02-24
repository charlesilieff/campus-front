import { Button, Menu, MenuButton, MenuList } from '@chakra-ui/react'
import React from 'react'
import { FaUsersCog } from 'react-icons/fa'
import { GoTriangleDown } from 'react-icons/go'

import { MenuItem2 } from './menu-item-2'

const adminMenuItems = (
  <>
    <MenuItem2 icon="users" to="/admin/user-management">
      Gestion des utilisateurs
    </MenuItem2>
  </>
)

const openAPIItem = (
  <MenuItem2 icon="book" to=":8080/docs">
    API
  </MenuItem2>
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
