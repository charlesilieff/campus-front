import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { NavLink as Link } from 'react-router-dom'
import { DropdownItem } from 'reactstrap'

export interface IMenuItem {
  children: React.ReactNode
  icon: IconProp
  to: string
  id?: string
  'data-cy'?: string
}

export default class MenuItem extends React.Component<IMenuItem> {
  render() {
    const { to, icon, id, children } = this.props

    return (
      <DropdownItem tag={Link} to={to} id={id} data-cy={this.props['data-cy']}>
        <FontAwesomeIcon icon={icon} fixedWidth /> {children}
      </DropdownItem>
    )
  }
}
