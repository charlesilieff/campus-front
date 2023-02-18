import { ErrorBoundaryRoutes } from 'app/shared/error/error-boundary-routes'
import React from 'react'
import { Route } from 'react-router-dom'

import { UserManagementRoutes } from './user-management'

export const AdministrationRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route path="user-management/*" element={<UserManagementRoutes />} />
  </ErrorBoundaryRoutes>
)
