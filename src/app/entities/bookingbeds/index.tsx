import React from 'react'
import { Switch } from 'react-router-dom'

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route'

import ReservationDeleteDialog from './reservation-delete-dialog'
import ReservationDetail from './reservation-detail'
import ReservationUpdate, { ReservationIntermittentUpdate } from './reservation-intermittent-update'
interface Match {
  url: string
}
const Routes = (data: { match: Match }): JSX.Element => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${data.match.url}/new`} component={ReservationUpdate} />

      <ErrorBoundaryRoute
        exact
        path={`${data.match.url}/new/intermittent`}
        component={ReservationIntermittentUpdate}
      />

      <ErrorBoundaryRoute exact path={`${data.match.url}/:id/edit`} component={ReservationUpdate} />
      <ErrorBoundaryRoute exact path={`${data.match.url}/:id`} component={ReservationDetail} />
    </Switch>
    <ErrorBoundaryRoute
      exact
      path={`${data.match.url}/:id/delete`}
      component={ReservationDeleteDialog}
    />
  </>
)

export default Routes
