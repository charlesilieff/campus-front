import React from 'react'
import Loadable from 'react-loadable'
import { Route } from 'react-router-dom'

import { AUTHORITIES } from './config/constants'
import { EntitiesRoutes } from './entities'
import Kitchen from './entities/kitchen'
import { ReservationRequestRoutes } from './entities/reservation-request'
import Activate from './modules/account/activate/activate'
import PasswordResetFinish from './modules/account/password-reset/finish/password-reset-finish'
import PasswordResetInit from './modules/account/password-reset/init/password-reset-init'
import Register from './modules/account/register/register'
import { RegisterIntermittentPage } from './modules/account/register/register-intermittent'
import Home from './modules/home/home'
import Login from './modules/login/login'
import Logout from './modules/login/logout'
import RGPD from './modules/rgpd/rgpd'
import { PrivateRoute } from './shared/auth/private-route'
import { ErrorBoundaryRoutes } from './shared/error/error-boundary-routes'
import PageNotFound from './shared/error/page-not-found'

const Account = Loadable({
  loader: () => import('./modules/account'),
  loading: () => <div>loading ...</div>
})

const Admin = Loadable({
  loader: () => import('./modules/administration'),
  loading: () => <div>loading ...</div>
})

const Routes = () => {
  return (
    <div className="view-routes">
      <ErrorBoundaryRoutes>
        <Route index element={<Home />} />
        <Route path="rgpd" element={<RGPD />} />
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
        <Route path="reservation-request" element={<ReservationRequestRoutes />} />
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
                <Account />
              </PrivateRoute>
            }
          />
          <Route path="register" element={<Register />} />
          <Route path="activate" element={<Activate />} />
          <Route path="reset">
            <Route path="request" element={<PasswordResetInit />} />
            <Route path="finish" element={<PasswordResetFinish />} />
          </Route>
        </Route>

        <Route
          path="kitchen/planning"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER, AUTHORITIES.COOKER]}>
              <Kitchen />
            </PrivateRoute>
          }
        />

        <Route
          path="admin/*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>
              <Admin />
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
    </div>
  )
}

export default Routes
