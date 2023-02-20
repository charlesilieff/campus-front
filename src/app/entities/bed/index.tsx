import { ErrorBoundaryRoutes } from 'app/shared/error/error-boundary-routes'
import React from 'react'
import { Route } from 'react-router-dom'

import { Bed } from './bed'
import { BedDetail } from './bed-detail'
import { BedUpdate } from './bed-update'

export const BedRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route path={`new`} element={<BedUpdate />} />
    <Route index element={<Bed />} />
    <Route path=":id">
      <Route path={`edit`} element={<BedUpdate />} />
      <Route index element={<BedDetail />} />
    </Route>
  </ErrorBoundaryRoutes>
)
