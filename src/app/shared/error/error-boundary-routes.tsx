import { ErrorBoundary } from 'app/shared/error/error-boundary'
import React from 'react'
import type { RouteProps } from 'react-router-dom'
import { Outlet, Route, Routes } from 'react-router-dom'

export const ErrorBoundaryRoutes = ({ children }: RouteProps) => (
  <Routes>
    <Route
      element={
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      }
    >
      {children}
    </Route>
  </Routes>
)
