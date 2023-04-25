import { Button, Menu, MenuButton, MenuList } from '@chakra-ui/react'
import React from 'react'
import { FaLock, FaSignInAlt, FaSignOutAlt, FaUserPlus, FaWrench } from 'react-icons/fa'
import { GoTriangleDown } from 'react-icons/go'
import { HiUser } from 'react-icons/hi'

import { MenuItem } from './menu-item'

const accountMenuItemsAuthenticated = (
  <>
    <MenuItem icon={<FaWrench />} to="/account/settings" data-cy="settings">
      Paramètres
    </MenuItem>
    <MenuItem icon={<FaLock />} to="/account/password" data-cy="passwordItem">
      Modifier le mot de passe{' '}
    </MenuItem>

    <MenuItem icon={<FaSignOutAlt />} to="/logout" data-cy="logout">
      Déconnexion
    </MenuItem>
  </>
)

const accountMenuItems = (
  <>
    <MenuItem icon={<FaSignInAlt />} to="/login">
      Connexion
    </MenuItem>
    <MenuItem icon={<FaUserPlus />} to="/account/register" id="compte">
      Création d&apos;un compte
    </MenuItem>
    <MenuItem icon={<FaUserPlus />} to="/account/register-intermittent" id="compte-intermittent">
      Création d&apos;un compte intermittent
    </MenuItem>
  </>
)

export const AccountMenu = ({ isAuthenticated = false }) => (
  <Menu>
    <MenuButton
      variant="menu"
      as={Button}
      aria-label="Options"
      leftIcon={<HiUser />}
      rightIcon={<GoTriangleDown />}
      size={{ base: 'sm', md: 'md' }}
    >
      Compte
    </MenuButton>

    <MenuList>{isAuthenticated ? accountMenuItemsAuthenticated : accountMenuItems}</MenuList>
  </Menu>
)
