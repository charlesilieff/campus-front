import { Button, Menu, MenuButton, MenuList } from '@chakra-ui/react'
import React from 'react'
import { FaBook, FaUsers, FaUsersCog } from 'react-icons/fa'
import { GoTriangleDown } from 'react-icons/go'

import { MenuItem } from './menu-item'

const adminMenuItems = (
  <>
    <MenuItem icon={<FaUsers />} to="/admin/user-management">
      Gestion des utilisateurs
    </MenuItem>
  </>
)

const openAPIItem = (
  <MenuItem icon={<FaBook />} to=":8080/docs">
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
      size={{ base: 'sm', md: 'md' }}
    >
      Administration
    </MenuButton>
    <MenuList>{adminMenuItems} {showOpenAPI && openAPIItem}</MenuList>
  </Menu>
)
