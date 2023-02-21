import { ErrorBoundaryRoutes } from 'app/shared/error/error-boundary-routes'
import React from 'react'
import { Route } from 'react-router-dom'

import { Pricing } from './pricing'
import { PricingDetail } from './pricing-detail'
import { PricingUpdate } from './pricing-update'

export const PricingRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route path={`new`} element={<PricingUpdate />} />
    <Route index element={<Pricing />} />
    <Route path=":id">
      <Route path={`edit`} element={<PricingUpdate />} />
      <Route index element={<PricingDetail />} />
    </Route>
  </ErrorBoundaryRoutes>
)
