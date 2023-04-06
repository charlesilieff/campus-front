import { ErrorBoundaryRoutes } from 'app/shared/error/error-boundary-routes'
import React from 'react'
import { Route } from 'react-router-dom'

import { ReservationIntermittentUpdate } from './intermittent/reservation-intermittent-update'
import { ReservationDetail } from './reservation-detail'
import { BookingBedsUpdate } from './resp-hebergement/reservation-update'

export const BookingBedsRoutes = (): JSX.Element => (
  <ErrorBoundaryRoutes>
    <Route path={`new`} element={<BookingBedsUpdate />} />
    <Route
      path={`new/intermittent`}
      element={<ReservationIntermittentUpdate />}
    />
    <Route
      path={`intermittent/:reservationId`}
      element={<ReservationIntermittentUpdate />}
    />
    <Route path=":reservationId">
      <Route path={`edit`} element={<BookingBedsUpdate />} />
      <Route index element={<ReservationDetail />} />
    </Route>
  </ErrorBoundaryRoutes>
)
