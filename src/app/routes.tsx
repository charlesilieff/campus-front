import React from 'react'
import Loadable from 'react-loadable'
import { Switch } from 'react-router-dom'

import { AUTHORITIES } from './config/constants'
import Entities from './entities'
import Kitchen from './entities/kitchen'
import ReservationRequest from './entities/reservation-request'
import Activate from './modules/account/activate/activate'
import PasswordResetFinish from './modules/account/password-reset/finish/password-reset-finish'
import PasswordResetInit from './modules/account/password-reset/init/password-reset-init'
import Register from './modules/account/register/register'
import RegisterIntermittent from './modules/account/register/register-intermittent'
import Home from './modules/home/home'
import Login from './modules/login/login'
import Logout from './modules/login/logout'
import RGPD from './modules/rgpd/rgpd'
import PrivateRoute from './shared/auth/private-route'
import ErrorBoundaryRoute from './shared/error/error-boundary-route'
import PageNotFound from './shared/error/page-not-found'

const Account = Loadable({
  loader: () => import(/* webpackChunkName: "account" */ './modules/account'),
  loading: () => <div>loading ...</div>
})

const Admin = Loadable({
  loader: () => import(/* webpackChunkName: "administration" */ './modules/administration'),
  loading: () => <div>loading ...</div>
})

const Routes = () => {
  return (
    <div className="view-routes">
      <Switch>
        <ErrorBoundaryRoute path="/rgpd" component={RGPD} />
        <ErrorBoundaryRoute path="/login" component={Login} />
        <ErrorBoundaryRoute path="/logout" component={Logout} />
        <ErrorBoundaryRoute
          path="/account/register-intermittent"
          component={RegisterIntermittent}
        />
        <ErrorBoundaryRoute path="/account/register" component={Register} />
        <ErrorBoundaryRoute path="/account/activate/:key?" component={Activate} />
        <ErrorBoundaryRoute path="/account/reset/request" component={PasswordResetInit} />
        <ErrorBoundaryRoute path="/account/reset/finish/:key?" component={PasswordResetFinish} />

        <ErrorBoundaryRoute path="/" exact component={Home} />
        <ErrorBoundaryRoute path="/reservation-request" component={ReservationRequest} />

        <PrivateRoute
          path="/kitchen/planning"
          component={Kitchen}
          hasAnyAuthorities={[AUTHORITIES.USER, AUTHORITIES.COOKER]}
        />
        <PrivateRoute path="/admin" component={Admin} hasAnyAuthorities={[AUTHORITIES.ADMIN]} />
        <PrivateRoute
          path="/account"
          component={Account}
          hasAnyAuthorities={[
            AUTHORITIES.ADMIN,
            AUTHORITIES.USER,
            AUTHORITIES.RESPHEBERGEMENT,
            AUTHORITIES.COOKER
          ]}
        />
        <PrivateRoute
          path="/"
          component={Entities}
          hasAnyAuthorities={[AUTHORITIES.USER, AUTHORITIES.RESPHEBERGEMENT]}
        />

        <ErrorBoundaryRoute component={PageNotFound} />
      </Switch>
    </div>
  )
}

export default Routes
