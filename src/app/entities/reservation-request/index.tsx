import React from 'react'
import { Switch } from 'react-router-dom'

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route'
import { ReservationRequestDetail, ReservationRequestUpdate } from './request'

import ReservationRequestDeleteDialog from './request-delete-dialog'

const Routes = ({ match }) => (
  <div>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ReservationRequestUpdate} />
      <ErrorBoundaryRoute
        exact
        path={`${match.url}/:id/edit`}
        component={ReservationRequestUpdate}
      />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ReservationRequestDetail} />
    </Switch>
    <ErrorBoundaryRoute
      exact
      path={`${match.url}/:id/delete`}
      component={ReservationRequestDeleteDialog}
    />
  </div>
)

export default Routes
