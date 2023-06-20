import './app.scss'
import './config/dayjs'

import { Box, Card } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import { AUTHORITIES } from './config/constants'
import { useAppDispatch, useAppSelector } from './config/store'
import { Routes as AppRoutes } from './routes'
import { hasAnyAuthority } from './shared/auth/private-route'
import { ErrorBoundary } from './shared/error/error-boundary'
import { Footer } from './shared/layout/footer/footer'
import { MainLayout } from './shared/layout/main-layout'
import { getProfile } from './shared/reducers/application-profile'
import { getSession } from './shared/reducers/authentication'

// @ts-expect-error normal
const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '')

export const App = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getSession())
    dispatch(getProfile())
  }, [])

  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated)
  const isAdmin = useAppSelector(state =>
    hasAnyAuthority(state.authentication.account, [AUTHORITIES.ADMIN])
  )
  const isIntermittent = useAppSelector(state =>
    hasAnyAuthority(state.authentication.account, [AUTHORITIES.INTERMITTENT])
  )
  const isUser = useAppSelector(state =>
    hasAnyAuthority(state.authentication.account, [AUTHORITIES.USER])
  )
  const isResp = useAppSelector(state =>
    hasAnyAuthority(state.authentication.account, [AUTHORITIES.RESPHEBERGEMENT])
  )
  const isHabitant = useAppSelector(state =>
    hasAnyAuthority(state.authentication.account, [AUTHORITIES.HABITANT])
  )
  const isEmployee = useAppSelector(state =>
    hasAnyAuthority(state.authentication.account, [AUTHORITIES.EMPLOYEE])
  )

  const ribbonEnv = useAppSelector(state => state.applicationProfile.ribbonEnv)
  const isInProduction = useAppSelector(state => state.applicationProfile.inProduction)

  return (
    <Router basename={baseHref}>
      <ErrorBoundary>
        <MainLayout
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
          ribbonEnv={ribbonEnv}
          isInProduction={isInProduction}
          isOpenAPIEnabled={true}
          isIntermittent={isIntermittent}
          isUser={isUser}
          isResp={isResp}
          isHabitant={isHabitant}
          isEmployee={isEmployee}
          main={
            <Box>
              <Card variant="outline" m={4} p={4}>
                <ErrorBoundary>
                  <AppRoutes />
                </ErrorBoundary>
              </Card>
              <Footer />
            </Box>
          }
        />
      </ErrorBoundary>
    </Router>
  )
}
