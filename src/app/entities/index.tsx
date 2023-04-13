import { ErrorBoundaryRoutes } from 'app/shared/error/error-boundary-routes'
import React from 'react'
import { Route } from 'react-router-dom'

import { BedRoutes } from './bed'
import { BedroomKindRoutes } from './bedroom-kind'
import { BookingBedsRoutes } from './bookingbeds'
import { IntermittentReservations } from './bookingbeds/intermittent/reservations-list'
import { CustomerRoutes } from './customer'
import { PlaceRoutes } from './place'
import { IndexPlanning } from './planning'
import { PricingRoutes } from './pricing'
// import { ReservationRoutes } from './reservation'
import { ReservationsToBeProcessed } from './reservation/reservations_to-be-processed'
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
            <Route path={'to-be-processed'} element={<ReservationsToBeProcessed />} />
            <Route
              path={'intermittent'}
              element={<IntermittentReservations />}
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
