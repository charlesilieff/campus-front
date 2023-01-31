import { Box, MenuItem as MenuItemChakra } from '@chakra-ui/react'
import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { NavLink as Link } from 'react-router-dom'

export interface IMenuItem {
  children: React.ReactNode
  icon: IconProp
  to: string
  id?: string
  'data-cy'?: string
}

export default class MenuItem2 extends React.Component<IMenuItem> {
  render() {
    const { to, icon, id, children } = this.props

    return (
      <MenuItemChakra
        as={Link}
        to={to}
        id={id}
        _hover={{ textDecoration: 'none', color: 'gray.900' }}
        data-cy={this.props['data-cy']}
        fontWeight={'normal'}
      >
        <FontAwesomeIcon icon={icon} fixedWidth /> <Box ml={2}>{children}</Box>
      </MenuItemChakra>
    )
  }
}
