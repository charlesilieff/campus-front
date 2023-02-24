import { Button, Menu, MenuButton, MenuList } from '@chakra-ui/react'
import React from 'react'
import { GoTriangleDown } from 'react-icons/go'
import { HiUser } from 'react-icons/hi'

import { MenuItem } from './menu-item'

const accountMenuItemsAuthenticated = (
  <>
    <MenuItem icon="wrench" to="/account/settings" data-cy="settings">
      Paramètres
    </MenuItem>
    <MenuItem icon="lock" to="/account/password" data-cy="passwordItem">
      Modifier le mot de passe
    </MenuItem>

    <MenuItem icon="sign-out-alt" to="/logout" data-cy="logout">
      Déconnexion
    </MenuItem>
  </>
)

const accountMenuItems = (
  <>
    <MenuItem id="login-item" icon="sign-in-alt" to="/login">
      Connexion
    </MenuItem>
    <MenuItem icon="user-plus" to="/account/register" id="compte">
      Création d&apos;un compte
    </MenuItem>
    <MenuItem icon="user-plus" to="/account/register-intermittent" id="compte-intermittent">
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
    >
      Compte
    </MenuButton>

    <MenuList>{isAuthenticated ? accountMenuItemsAuthenticated : accountMenuItems}</MenuList>
  </Menu>
)
