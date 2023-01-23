import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route'
import React from 'react'
import { Switch } from 'react-router-dom'

import ReservationUpdate from '../reservation/reservation-update'
import { ReservationIntermittentUpdate } from './intermittent/reservation-intermittent-update'
import ReservationDeleteDialog from './reservation-delete-dialog'
import ReservationDetail from './reservation-detail'

interface Match {
  url: string
}
const Routes = (data: { match: Match }): JSX.Element => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${data.match.url}/new`} component={ReservationUpdate} />

      <ErrorBoundaryRoute exact path={`${data.match.url}/:id/edit`} component={ReservationUpdate} />
      <ErrorBoundaryRoute exact path={`${data.match.url}/:id`} component={ReservationDetail} />
      <ErrorBoundaryRoute
        exact
        path={`${data.match.url}/new/intermittent/:id`}
        component={ReservationIntermittentUpdate}
      />
    </Switch>
    <ErrorBoundaryRoute
      exact
      path={`${data.match.url}/:id/delete`}
      component={ReservationDeleteDialog}
    />
  </>
)

export default Routes
