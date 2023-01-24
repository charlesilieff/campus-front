import { ErrorBoundaryRoutes } from 'app/shared/error/error-boundary-routes'
import React from 'react'
import { Route } from 'react-router-dom'

import { ReservationRequestDetail, ReservationRequestUpdate } from './request'
import ReservationRequestDeleteDialog from './request-delete-dialog'

export const ReservationRequestRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route path={`new`} element={<ReservationRequestUpdate />} />

    <Route path={`:id`}>
      <Route
        path={`edit`}
        element={<ReservationRequestUpdate />}
      />
      <Route index element={<ReservationRequestDetail />} />
      <Route
        path={`delete`}
        element={<ReservationRequestDeleteDialog />}
      />
    </Route>
  </ErrorBoundaryRoutes>
)
