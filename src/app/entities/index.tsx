import { ErrorBoundaryRoutes } from 'app/shared/error/error-boundary-routes'
import React from 'react'
import { Route } from 'react-router-dom'

import { BedRoutes } from './bed'
import { BedroomKindRoutes } from './bedroom-kind'
import { BookingBedsRoutes } from './bookingbeds'
import { MyIntermittentReservations } from './bookingbeds/intermittent/my-reservations'
import { MyEmployeeReservations } from './bookingbeds/resp-hebergement-for-employee/my-reservations'
import { MyHabitantReservations } from './bookingbeds/resp-hebergement-for-habitant/my-reservations'
import { CustomerRoutes } from './customer'
import { PlaceRoutes } from './place'
import { IndexPlanning } from './planning'
import { PricingRoutes } from './pricing'
import { ReservationsListEmployee } from './reservation/reservations_employee'
// import { ReservationRoutes } from './reservation'
import { ReservationsListToBeProcessed } from './reservation/reservations_to-be-processed'
import { RoomRoutes } from './room'
import { TypeReservationRoutes } from './type-reservation'
import { UserCategoryRoutes } from './user-category'

export const EntitiesRoutes = () => (
  <div>
    <ErrorBoundaryRoutes>
      <Route
        path={`reservation/*`}
        element={
          <ErrorBoundaryRoutes>
            <Route path={'to-be-processed'} element={<ReservationsListToBeProcessed />} />
            <Route path={'employee'} element={<ReservationsListEmployee />} />
            <Route path={'my-employee-reservations'} element={<MyEmployeeReservations />} />
            <Route
              path={'my-intermittent-reservations'}
              element={<MyIntermittentReservations />}
            />
            <Route
              path={'my-habitant-reservations'}
              element={<MyHabitantReservations />}
            />
          </ErrorBoundaryRoutes>
        }
      />

      <Route path={`bookingbeds/*`} element={<BookingBedsRoutes />} />
      <Route path={`customer/*`} element={<CustomerRoutes />} />
      <Route path={`pricing/*`} element={<PricingRoutes />} />
      <Route path={`bed/*`} element={<BedRoutes />} />
      <Route path={`room/*`} element={<RoomRoutes />} />
      <Route path={`bedroom-kind/*`} element={<BedroomKindRoutes />} />
      <Route path={`planning/*`} element={<IndexPlanning />} />
      <Route path={`place/*`} element={<PlaceRoutes />} />
      <Route path={`type-reservation/*`} element={<TypeReservationRoutes />} />
      <Route path={`user-category/*`} element={<UserCategoryRoutes />} />
    </ErrorBoundaryRoutes>
  </div>
)
