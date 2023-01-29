// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ErrorBoundaryRoutes } from 'app/shared/error/error-boundary-routes'
import React from 'react'
import { Route } from 'react-router-dom'

import { BedRoutes } from './bed'
import { BedroomKindRoutes } from './bedroom-kind'
import BookingBeds from './bookingbeds'
import { CustomerRoutes } from './customer'
import { PlaceRoutes } from './place'
import Planning from './planning'
import { PricingRoutes } from './pricing'
import Reservation from './reservation'
import ReservationLunchOnly from './reservation/reservation_isLunchOnly'
import ReservationNotConfirmed from './reservation/reservation_nobeds_notconfirmed'
import { RoomRoutes } from './room'

/* jhipster-needle-add-route-import - JHipster will add routes here */

export const EntitiesRoutes = () => (
  <div>
    <ErrorBoundaryRoutes>
      <Route path={'reservation/to-be-processed'} element={<ReservationNotConfirmed />} />
      <Route path={'reservation/lunch-only'} element={<ReservationLunchOnly />} />
      <Route path={`bookingbeds/*`} element={<BookingBeds />} />
      <Route path={`reservation/*`} element={<Reservation />} />
      <Route path={`customer/*`} element={<CustomerRoutes />} />
      <Route path={`pricing/*`} element={<PricingRoutes />} />
      <Route path={`bed/*`} element={<BedRoutes />} />
      <Route path={`room/*`} element={<RoomRoutes />} />
      <Route path={`bedroom-kind/*`} element={<BedroomKindRoutes />} />
      <Route path={`planning/*`} element={<Planning />} />
      <Route path={`place/*`} element={<PlaceRoutes />} />
    </ErrorBoundaryRoutes>
  </div>
)
