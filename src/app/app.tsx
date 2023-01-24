import 'react-toastify/dist/ReactToastify.css'
import './app.scss'
import './config/dayjs'

import { useEffect } from 'react'
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { Card } from 'reactstrap'

import { AUTHORITIES } from './config/constants'
import { useAppDispatch, useAppSelector } from './config/store'
import AppRoutes from './routes'
import { hasAnyAuthority } from './shared/auth/private-route'
import ErrorBoundary from './shared/error/error-boundary'
import Footer from './shared/layout/footer/footer'
import Header from './shared/layout/header/header'
import { getProfile } from './shared/reducers/application-profile'
import { getSession } from './shared/reducers/authentication'

const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '')

export const App = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getSession())
    dispatch(getProfile())
  }, [])

  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated)
  const isAdmin = useAppSelector(state =>
    hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN])
  )
  const isCooker = useAppSelector(state =>
    hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.COOKER])
  )
  const isUser = useAppSelector(state =>
    hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.USER])
  )
  const isResp = useAppSelector(state =>
    hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.RESPHEBERGEMENT])
  )
  const ribbonEnv = useAppSelector(state => state.applicationProfile.ribbonEnv)
  const isInProduction = useAppSelector(state => state.applicationProfile.inProduction)
  const isOpenAPIEnabled = useAppSelector(state => state.applicationProfile.isOpenAPIEnabled)

  const paddingTop = '60px'
  return (
    <Router basename={baseHref}>
      <div className="app-container" style={{ paddingTop }}>
        <ToastContainer
          position={toast.POSITION.TOP_LEFT}
          className="toastify-container"
          toastClassName="toastify-toast"
        />
        <ErrorBoundary>
          <Header
            isAuthenticated={isAuthenticated}
            isAdmin={isAdmin}
            ribbonEnv={ribbonEnv}
            isInProduction={isInProduction}
            isOpenAPIEnabled={isOpenAPIEnabled}
            isCooker={isCooker}
            isUser={isUser}
            isResp={isResp}
          />
        </ErrorBoundary>
        <div className="container-fluid view-container" id="app-view-container">
          <Card className="jh-card">
            <ErrorBoundary>
              <AppRoutes />
            </ErrorBoundary>
          </Card>
          <Footer />
        </div>
      </div>
    </Router>
  )
}

export default App
