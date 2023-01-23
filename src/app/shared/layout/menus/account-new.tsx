import { Button, Menu, MenuButton, MenuList } from '@chakra-ui/react'
import { GoTriangleDown } from '@react-icons/all-files/go/GoTriangleDown'
import { HiUser } from '@react-icons/all-files/hi/HiUser'
import React from 'react'

import MenuItem2 from './menu-item-2'

const accountMenuItemsAuthenticated = (
  <>
    <MenuItem2 icon="wrench" to="/account/settings" data-cy="settings">
      Paramètres
    </MenuItem2>
    <MenuItem2 icon="lock" to="/account/password" data-cy="passwordItem">
      Modifier le mot de passe
    </MenuItem2>

    <MenuItem2 icon="sign-out-alt" to="/logout" data-cy="logout">
      Déconnexion
    </MenuItem2>
  </>
)

const accountMenuItems = (
  <>
    <MenuItem2 id="login-item" icon="sign-in-alt" to="/login">
      Connexion
    </MenuItem2>
    <MenuItem2 icon="user-plus" to="/account/register" id="compte">
      Création d&apos;un compte
    </MenuItem2>
    <MenuItem2 icon="user-plus" to="/account/register-intermittent" id="compte-intermittent">
      Création d&apos;un compte intermittent
    </MenuItem2>
  </>
)

export const AccountMenu2 = ({ isAuthenticated = false }) => (
  <Menu>
    <MenuButton
      as={Button}
      aria-label="Options"
      leftIcon={<HiUser />}
      rightIcon={<GoTriangleDown />}
    >
      Compte
    </MenuButton>
    <MenuList>
      <MenuList>{isAuthenticated ? accountMenuItemsAuthenticated : accountMenuItems}</MenuList>
    </MenuList>
  </Menu>
)
