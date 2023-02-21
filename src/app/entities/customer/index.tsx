import { ErrorBoundaryRoutes } from 'app/shared/error/error-boundary-routes'
import React from 'react'
import { Route } from 'react-router-dom'

import { Customer } from './customer'
import { CustomerDetail } from './customer-detail'
import { CustomerUpdate } from './customer-update'

export const CustomerRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Customer />} />
    <Route path={`new`} element={<CustomerUpdate />} />
    <Route path=":id">
      <Route index element={<CustomerDetail />} />
      <Route path={`edit`} element={<CustomerUpdate />} />
    </Route>
  </ErrorBoundaryRoutes>
)
