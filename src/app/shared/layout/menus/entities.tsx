import { Button, Menu, MenuButton, MenuList } from '@chakra-ui/react'
import { MenuItem } from 'app/shared/layout/menus/menu-item'
import React from 'react'
import { FaBed, FaCalendar, FaEuroSign, FaIgloo, FaMapMarkedAlt, FaPersonBooth, FaSnowman,
  FaUtensils } from 'react-icons/fa'
import { GoTriangleDown } from 'react-icons/go'
import { HiViewList } from 'react-icons/hi'

interface EntitiesMenuProps {
  isResp: boolean
  isUser: boolean
  isIntermittent: boolean
  isHabitant: boolean
  isEmployee: boolean
}

export const EntitiesMenu = (props: EntitiesMenuProps) => (
  <Menu>
    <MenuButton
      variant="menu"
      as={Button}
      aria-label="Options"
      leftIcon={<HiViewList />}
      rightIcon={<GoTriangleDown />}
      size={{ base: 'sm', md: 'md' }}
    >
      {'Menu'}
    </MenuButton>
    <MenuList>
      {props.isResp && (
        <>
          <MenuItem icon={<FaSnowman />} to="/customer">
            Clients
          </MenuItem>
          <MenuItem icon={<FaEuroSign />} to="/pricing">
            Tarifications
          </MenuItem>
          <MenuItem icon={<FaBed />} to="/bed">
            Lits
          </MenuItem>
          <MenuItem icon={<FaPersonBooth />} to="/room">
            Chambres
          </MenuItem>
          <MenuItem icon={<FaIgloo />} to="/bedroom-kind">
            Type de chambres
          </MenuItem>
          <MenuItem icon={<FaMapMarkedAlt />} to="/place">
            Lieux
          </MenuItem>
          <MenuItem icon={<FaMapMarkedAlt />} to="/place/intermittent">
            Intermittent
          </MenuItem>
        </>
      )}
      {(props.isResp || props.isUser) && (
        <MenuItem icon={<FaUtensils />} to="/kitchen/planning">
          Repas
        </MenuItem>
      )}
      {(props.isResp || props.isUser) && (
        <MenuItem icon={<FaCalendar />} to="/planning">
          Planning
        </MenuItem>
      )}
      {(props.isIntermittent) && (
        <MenuItem icon={<FaCalendar />} to="/reservation/my-intermittent-reservations">
          Mes réservations (intermittent)
        </MenuItem>
      )}
      {(props.isHabitant) && (
        <MenuItem icon={<FaCalendar />} to="/reservation/my-habitant-reservations">
          Mes réservations (habitant)
        </MenuItem>
      )}
      {(props.isEmployee) && (
        <MenuItem icon={<FaCalendar />} to="/reservation/my-employee-reservations">
          Mes réservations (salariés)
        </MenuItem>
      )}
      {(props.isHabitant || props.isEmployee) && (
        <MenuItem icon={<FaUtensils />} to="/meals/planning">
          Mes repas
        </MenuItem>
      )}
    </MenuList>
  </Menu>
)
