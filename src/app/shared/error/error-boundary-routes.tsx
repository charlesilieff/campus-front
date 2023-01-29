import { ErrorBoundary } from 'app/shared/error/error-boundary'
import React from 'react'
import { Outlet, Route, RouteProps, Routes } from 'react-router-dom'

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
