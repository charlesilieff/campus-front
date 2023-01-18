import React from 'react'
import LoadingBar from 'react-redux-loading-bar'
import { Nav, Navbar } from 'reactstrap'
import { AccountMenu, AdminMenu, EntitiesMenu } from '../menus'
import { Brand, Help, Home } from './header-components'
import './header.scss'

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
  const renderDevRibbon = () =>
    props.isInProduction === false ?
      (
        <div className="ribbon dev">
          <a href="">Development</a>
        </div>
      ) :
      null

  /* jhipster-needle-add-element-to-menu - JHipster will add new menu items here */

  return (
    <div id="app-header">
      {renderDevRibbon()}
      <LoadingBar className="loading-bar" />
      <Navbar data-cy="navbar" dark expand="sm" fixed="top" className="bg-primary">
        <Brand />
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
      </Navbar>
    </div>
  )
}

export default Header
