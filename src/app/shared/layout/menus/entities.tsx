import { faBed, faCalendar, faEuroSign, faIgloo, faMapMarkedAlt, faPersonBooth, faSnowman,
  faUtensils } from '@fortawesome/free-solid-svg-icons'
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

    {props.isResp && (
      <>
        <MenuItem icon={faSnowman} to="/customer">
          Clients
        </MenuItem>
        <MenuItem icon={faEuroSign} to="/pricing">
          Tarifications
        </MenuItem>
        <MenuItem icon={faBed} to="/bed">
          Lits
        </MenuItem>
        <MenuItem icon={faPersonBooth} to="/room">
          Chambres
        </MenuItem>
        <MenuItem icon={faIgloo} to="/bedroom-kind">
          Type de chambres
        </MenuItem>
        <MenuItem icon={faMapMarkedAlt} to="/place">
          Lieux
        </MenuItem>
        <MenuItem icon={faMapMarkedAlt} to="/place/intermittent">
          Intermittent
        </MenuItem>
      </>
    )}
    {
      <MenuItem icon={faUtensils} to="/kitchen/planning">
        Repas
      </MenuItem>
    }
    {(props.isResp || props.isUser) && (
      <MenuItem icon={faCalendar} to="/planning">
        Planning
      </MenuItem>
    )}
    {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
  </NavDropdown>
)
