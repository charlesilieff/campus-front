import { ErrorBoundaryRoutes } from 'app/shared/error/error-boundary-routes'
import React from 'react'
import { Route } from 'react-router-dom'

import { Password } from './password/password'
import { Settings } from './settings/settings'

export const AccountRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route path="settings" element={<Settings />} />
    <Route path="password" element={<Password />} />
  </ErrorBoundaryRoutes>
)
