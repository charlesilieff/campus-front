import { HStack, MenuItem as MenuItemChakra, Text } from '@chakra-ui/react'
import React from 'react'
import { NavLink as Link } from 'react-router-dom'

export interface IMenuItem {
  children: React.ReactNode
  icon: React.ReactNode
  to: string
  id?: string
}

export class MenuItem extends React.Component<IMenuItem> {
  render() {
    const { to, icon, id, children } = this.props

    return (
      <MenuItemChakra
        as={Link}
        to={to}
        id={id}
        _hover={{ textDecoration: 'none', color: 'gray.900' }}
        fontWeight={'normal'}
      >
        <HStack ml={2}>
          {icon}
          <Text>{children}</Text>
        </HStack>
      </MenuItemChakra>
    )
  }
}
