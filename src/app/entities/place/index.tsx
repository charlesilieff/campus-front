import { ErrorBoundaryRoutes } from 'app/shared/error/error-boundary-routes'
import React from 'react'
import { Route } from 'react-router-dom'

import { Place } from './place'
import { PlaceDetail } from './place-detail'
import { PlaceIntermittent } from './place-intermittent'
import { PlaceUpdate } from './place-update'

export const PlaceRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route path={`new`} element={<PlaceUpdate />} />
    <Route path={`intermittent`} element={<PlaceIntermittent />} />
    <Route index element={<Place />} />
    <Route path=":id">
      <Route path={`edit`} element={<PlaceUpdate />} />
      <Route index element={<PlaceDetail />} />
    </Route>
  </ErrorBoundaryRoutes>
)
