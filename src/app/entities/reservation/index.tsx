import { ErrorBoundaryRoutes } from 'app/shared/error/error-boundary-routes'
import React from 'react'
import { Route } from 'react-router-dom'

import Reservation from './reservation'
import ReservationDeleteDialog from './reservation-delete-dialog'
import ReservationDetail from './reservation-detail'

const Routes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Reservation />} />
    <Route path=":id">
      <Route
        path={`delete`}
        element={<ReservationDeleteDialog />}
      />
      <Route index element={<ReservationDetail />} />
    </Route>
  </ErrorBoundaryRoutes>
)

export default Routes
