import { Text } from '@chakra-ui/react'
import { ErrorBoundaryRoutes } from 'app/shared/error/error-boundary-routes'
import React from 'react'
import { Route } from 'react-router-dom'

// import UserManagement from './user-management'

export const AdministrationRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route path="user-management/*" element={<Text>Coucou</Text>} />
  </ErrorBoundaryRoutes>
)
