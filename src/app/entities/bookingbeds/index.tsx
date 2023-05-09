import { ErrorBoundaryRoutes } from 'app/shared/error/error-boundary-routes'
import React from 'react'
import { Route } from 'react-router-dom'

import { ReservationIntermittentUpdate } from './intermittent/reservation-intermittent-update'
import { ReservationInviteUpdate } from './invite/reservation-invite-update'
import { ReservationDetail } from './reservation-detail'
import { ReservationUpdate } from './resp-hebergement/reservation-update'
// import { ReservationUserUpdate } from './resp-hebergement-for-user/reservation-update'
import { ReservationUserUpdate } from './resp-hebergement-for-user/reservation-update'

export const BookingBedsRoutes = (): JSX.Element => (
  <ErrorBoundaryRoutes>
    <Route path={`new`} element={<ReservationUpdate />} />
    <Route
      path={`new/intermittent`}
      element={<ReservationIntermittentUpdate />}
    />
    <Route
      path={`new/habitant`}
      element={<ReservationUserUpdate />}
    />
    <Route
      path={`new/invite`}
      element={<ReservationInviteUpdate />}
    />
    <Route
      path={`invite/:reservationId`}
      element={<ReservationInviteUpdate />}
    />
    <Route
      path={`intermittent/:reservationId`}
      element={<ReservationIntermittentUpdate />}
    />
    <Route path=":reservationId">
      <Route path={`edit`} element={<ReservationUpdate />} />
      <Route index element={<ReservationDetail />} />
    </Route>
  </ErrorBoundaryRoutes>
)
