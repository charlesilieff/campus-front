import MenuItem from 'app/shared/layout/menus/menu-item'
import React from 'react'

import { NavDropdown } from './menu-components'

export const EntitiesMenu = props => (
  <NavDropdown
    icon="th-list"
    name="Gestion de l'hébergement"
    id="entity-menu"
    data-cy="entity"
    style={{ maxHeight: '80vh', overflow: 'auto' }}
  >
    <>{/* to avoid warnings when empty */}</>
    {
      /* <MenuItem icon="coffee" to="/reservation">
      Réservations
    </MenuItem> */
    }
    {props.isResp && (
      <>
        <MenuItem icon="snowman" to="/customer">
          Clients
        </MenuItem>
        <MenuItem icon="euro-sign" to="/pricing">
          Tarifications
        </MenuItem>
        <MenuItem icon="bed" to="/bed">
          Lits
        </MenuItem>
        <MenuItem icon="person-booth" to="/room">
          Chambres
        </MenuItem>
        <MenuItem icon="igloo" to="/bedroom-kind">
          Type de chambres
        </MenuItem>
        <MenuItem icon="map-marked-alt" to="/place">
          Lieux
        </MenuItem>
      </>
    )}
    {props.isCooker && (
      <MenuItem icon="utensils" to="/kitchen/planning">
        Repas
      </MenuItem>
    )}
    {(props.isResp || props.isUser) && (
      <MenuItem icon="calendar-day" to="/planning">
        Planning
      </MenuItem>
    )}
    {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
  </NavDropdown>
)
