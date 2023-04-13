import { ErrorBoundaryRoutes } from 'app/shared/error/error-boundary-routes'
import React from 'react'
import { Route } from 'react-router-dom'

// import { UserCategory } from './user-category'
// import { UserCategoryDetail } from './user-category-detail'
import { UserCategoryUpdate } from './user-category-update'

export const UserCategoryRoutes = () => (
  <ErrorBoundaryRoutes>
    {<Route path={`new`} element={<UserCategoryUpdate />} />}
    <Route path=":id">
      <Route path={`edit`} element={<UserCategoryUpdate />} />
    </Route>
  </ErrorBoundaryRoutes>
)
