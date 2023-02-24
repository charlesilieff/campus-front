import { ErrorBoundaryRoutes } from 'app/shared/error/error-boundary-routes'
import React from 'react'
import { Route } from 'react-router-dom'

import { UserManagement } from './user-management'
import { UserManagementDetail } from './user-management-detail'
import { UserManagementUpdate } from './user-management-update'

export const UserManagementRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route path={`new`} element={<UserManagementUpdate />} />
    <Route index element={<UserManagement />} />
    <Route path=":login">
      <Route index element={<UserManagementDetail />} />
      <Route
        path={`edit`}
        element={<UserManagementUpdate />}
      />
    </Route>
  </ErrorBoundaryRoutes>
)
