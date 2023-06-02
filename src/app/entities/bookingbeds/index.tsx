import { ErrorBoundaryRoutes } from 'app/shared/error/error-boundary-routes'
import React from 'react'
import { Route } from 'react-router-dom'

import { OneBedReservationUpdate } from './intermittent/reservation-intermittent-update'
import { ReservationInviteUpdate } from './invite/reservation-invite-update'
import { ReservationDetail } from './reservation-detail'
import { ReservationUpdate } from './resp-hebergement/reservation-update'
// import { ReservationUserUpdate } from './resp-hebergement-for-user/reservation-update'
import { ReservationEmployeeUpdate } from './resp-hebergement-for-employee/reservation-update'
import { ReservationHabitantUpdate } from './resp-hebergement-for-habitant/reservation-update'

export const BookingBedsRoutes = (): JSX.Element => (
  <ErrorBoundaryRoutes>
    <Route path={`new`} element={<ReservationUpdate />} />
    <Route
      path={`new/intermittent`}
      element={<OneBedReservationUpdate />}
    />
    <Route
      path={`new/habitant`}
      element={<ReservationHabitantUpdate />}
    />
    <Route
      path={`new/employee`}
      element={<ReservationEmployeeUpdate />}
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
      element={<OneBedReservationUpdate />}
    />
    <Route
      path={`employee/:reservationId`}
      element={<ReservationEmployeeUpdate />}
    />
    <Route path=":reservationId">
      <Route path={`edit`} element={<ReservationUpdate />} />
      <Route index element={<ReservationDetail />} />
    </Route>
  </ErrorBoundaryRoutes>
)
