import React from 'react'
import { Switch } from 'react-router-dom'

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route'

import Reservation from './reservation'
import ReservationDeleteDialog from './reservation-delete-dialog'
import ReservationDetail from './reservation-detail'
import ReservationUpdate from './reservation-update'

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ReservationUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ReservationUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ReservationDetail} />
      <ErrorBoundaryRoute path={match.url} component={Reservation} />
    </Switch>
    <ErrorBoundaryRoute
      exact
      path={`${match.url}/:id/delete`}
      component={ReservationDeleteDialog}
    />
  </>
)

export default Routes
