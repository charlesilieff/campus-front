import './header.scss'

import React, { useState } from 'react'
import { Translate } from 'react-jhipster'
import LoadingBar from 'react-redux-loading-bar'
import { Collapse, Nav, Navbar, NavbarToggler } from 'reactstrap'

import { AccountMenu, AdminMenu, EntitiesMenu } from '../menus'
import { Brand, Help, Home } from './header-components'

export interface IHeaderProps {
  isCooker: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  isResp: boolean
  ribbonEnv: string
  isInProduction: boolean
  isOpenAPIEnabled: boolean
  isUser: boolean
}

const Header = (props: IHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false)

  const renderDevRibbon = () =>
    props.isInProduction === false ?
      (
        <div className="ribbon dev">
          <a href="">
            <Translate contentKey={`global.ribbon.${props.ribbonEnv}`} />
          </a>
        </div>
      ) :
      null

  const toggleMenu = () => setMenuOpen(!menuOpen)

  /* jhipster-needle-add-element-to-menu - JHipster will add new menu items here */

  return (
    <div id="app-header">
      {renderDevRibbon()}
      <LoadingBar className="loading-bar" />
      <Navbar data-cy="navbar" expand="md" fixed="top" className="jh-navbar" color={'primary'} dark>
        <NavbarToggler aria-label="Menu" onClick={toggleMenu} />
        <Brand />
        <Collapse isOpen={menuOpen} navbar>
          <Nav id="header-tabs" className="ml-auto" navbar>
            {!window.location.pathname.endsWith('reservation-request/new') && <Help />}
            {!window.location.pathname.endsWith('reservation-request/new') && <Home />}

            {props.isAuthenticated && (
              <EntitiesMenu isResp={props.isResp} isCooker={props.isCooker} isUser={props.isUser} />
            )}
            {props.isAuthenticated && props.isAdmin && (
              <AdminMenu showOpenAPI={props.isOpenAPIEnabled} />
            )}
            {!window.location.pathname.endsWith('reservation-request/new') && (
              <AccountMenu isAuthenticated={props.isAuthenticated} />
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  )
}

export default Header
