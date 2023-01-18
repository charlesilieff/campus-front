import MenuItem from 'app/shared/layout/menus/menu-item'
import React from 'react'

import { NavDropdown } from './menu-components'

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
    <MenuItem id="login-item" icon="sign-in-alt" to="/login" data-cy="login">
      Connexion
    </MenuItem>
    <MenuItem icon="user-plus" to="/account/register" data-cy="register">
      Création d&apos;un compte
    </MenuItem>
  </>
)

export const AccountMenu = ({ isAuthenticated = false }) => (
  <NavDropdown icon="user" name="Compte" id="account-menu" data-cy="accountMenu">
    {isAuthenticated ? accountMenuItemsAuthenticated : accountMenuItems}
  </NavDropdown>
)

export default AccountMenu
