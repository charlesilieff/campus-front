import React from 'react'
import { Route } from 'react-router-dom'

import { AUTHORITIES } from './config/constants'
import { EntitiesRoutes } from './entities'
import { Index } from './entities/kitchen'
import { RequestDeleteDialog } from './entities/reservation-request/request-delete-dialog'
import { ReservationRequestDetail } from './entities/reservation-request/request-detail'
import { DemandUpdate as ReservationRequestUpdate } from './entities/reservation-request/request-update'
import { AccountRoutes } from './modules/account'
import { Activate } from './modules/account/activate/activate'
import { PasswordResetFinish } from './modules/account/password-reset/finish/password-reset-finish'
import { PasswordResetInit } from './modules/account/password-reset/init/password-reset-init'
import { RegisterPage } from './modules/account/register/register'
import { RegisterIntermittentPage } from './modules/account/register/register-intermittent'
import { AdministrationRoutes } from './modules/administration'
import { Home } from './modules/home/home'
import { Login } from './modules/login/login'
import { Logout } from './modules/login/logout'
import { RGPD } from './modules/rgpd/rgpd'
import { PrivateRoute } from './shared/auth/private-route'
import { ErrorBoundaryRoutes } from './shared/error/error-boundary-routes'
import { PageNotFound } from './shared/error/page-not-found'

export const Routes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Home />} />
    <Route path="rgpd" element={<RGPD />} />
    <Route path="login" element={<Login />} />
    <Route path="logout" element={<Logout />} />

    <Route path="reservation-request">
      <Route path="new" element={<ReservationRequestUpdate />}></Route>
      <Route path={`:id`}>
        <Route
          path={`edit`}
          element={<ReservationRequestUpdate />}
        />
        <Route index element={<ReservationRequestDetail />} />
        <Route
          path={`delete`}
          element={<RequestDeleteDialog />}
        />
      </Route>
    </Route>
    <Route path="account">
      <Route
        path="register-intermittent"
        element={<RegisterIntermittentPage />}
      />

      <Route
        path="*"
        element={
          <PrivateRoute
            hasAnyAuthorities={[
              AUTHORITIES.ADMIN,
              AUTHORITIES.USER,
              AUTHORITIES.RESPHEBERGEMENT,
              AUTHORITIES.COOKER,
              AUTHORITIES.INTERMITTENT
            ]}
          >
            <AccountRoutes />
          </PrivateRoute>
        }
      />
      <Route path="register" element={<RegisterPage />} />
      <Route path="activate" element={<Activate />} />
      <Route path="reset">
        <Route path="request" element={<PasswordResetInit />} />
        <Route path="finish" element={<PasswordResetFinish />} />
      </Route>
    </Route>
    <Route path="admin">
      <Route
        path="*"
        element={
          <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>
            <AdministrationRoutes />
          </PrivateRoute>
        }
      >
      </Route>
    </Route>

    <Route
      path="kitchen/planning"
      element={
        <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER, AUTHORITIES.COOKER]}>
          <Index />
        </PrivateRoute>
      }
    />

    <Route
      path="*"
      element={
        <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER, AUTHORITIES.RESPHEBERGEMENT]}>
          <EntitiesRoutes />
        </PrivateRoute>
      }
    />

    <Route element={<PageNotFound />} />
  </ErrorBoundaryRoutes>
)
