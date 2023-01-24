import { ErrorBoundaryRoutes } from 'app/shared/error/error-boundary-routes'
import React from 'react'
import { Route } from 'react-router-dom'

import ReservationUpdate from '../reservation/reservation-update'
import { ReservationIntermittentUpdate } from './intermittent/reservation-intermittent-update'
import { BookingBedsUpdate } from './new-reservation'
import ReservationDeleteDialog from './reservation-delete-dialog'
import ReservationDetail from './reservation-detail'

const Routes = (): JSX.Element => (
  <ErrorBoundaryRoutes>
    <Route path={`new`} element={<ReservationUpdate />} />

    <Route path=":id">
      <Route
        path={`new/intermittent`}
        element={<ReservationIntermittentUpdate />}
      />
      <Route path={`edit`} element={<BookingBedsUpdate />} />
      <Route index element={<ReservationDetail />} />
      <Route
        path={`delete`}
        element={<ReservationDeleteDialog />}
      />
    </Route>
  </ErrorBoundaryRoutes>
)

export default Routes
