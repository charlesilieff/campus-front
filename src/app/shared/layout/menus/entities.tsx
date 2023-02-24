import { Button, Menu, MenuButton, MenuList } from '@chakra-ui/react'
import {
  faBed,
  faCalendar,
  faEuroSign,
  faIgloo,
  faMapMarkedAlt,
  faPersonBooth,
  faSnowman,
  faUtensils
} from '@fortawesome/free-solid-svg-icons'
import { MenuItem } from 'app/shared/layout/menus/menu-item'
import React from 'react'
import { GoTriangleDown } from 'react-icons/go'
import { HiViewList } from 'react-icons/hi'

interface EntitiesMenuProps {
  isResp: boolean
  isUser: boolean
  isIntermittent: boolean
}

export const EntitiesMenu = (props: EntitiesMenuProps) => (
  <Menu>
    <MenuButton
      variant="menu"
      as={Button}
      aria-label="Options"
      leftIcon={<HiViewList />}
      rightIcon={<GoTriangleDown />}
    >
      {"Gestion de l'hébergement"}
    </MenuButton>
    <MenuList>
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
      {(props.isIntermittent) && (
        <MenuItem icon={faCalendar} to="/reservation/intermittent">
          Mes réservations
        </MenuItem>
      )}
    </MenuList>
  </Menu>
)
