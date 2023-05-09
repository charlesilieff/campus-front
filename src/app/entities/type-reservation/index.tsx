import { ErrorBoundaryRoutes } from 'app/shared/error/error-boundary-routes'
import React from 'react'
import { Route } from 'react-router-dom'

// import { TypeReservation } from './type-reservation'
import { TypeReservationDetail } from './type-reservation-detail'
import { TypeReservationUpdate } from './type-reservation-update'

export const TypeReservationRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route path=":id">
      <Route path={`edit`} element={<TypeReservationUpdate />} />
      <Route index element={<TypeReservationDetail />} />
    </Route>
  </ErrorBoundaryRoutes>
)
