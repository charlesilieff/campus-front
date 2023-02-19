import { ErrorBoundaryRoutes } from 'app/shared/error/error-boundary-routes'
import React from 'react'
import { Route } from 'react-router-dom'

import { BedroomKind } from './bedroom-kind'
import { BedroomKindDeleteDialog } from './bedroom-kind-delete-dialog'
import { BedroomKindDetail } from './bedroom-kind-detail'
import { BedroomKindUpdate } from './bedroom-kind-update'

export const BedroomKindRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route path={`new`} element={<BedroomKindUpdate />} />
    <Route index element={<BedroomKind />} />
    <Route path=":id">
      <Route path={`edit`} element={<BedroomKindUpdate />} />
      <Route index element={<BedroomKindDetail />} />
      <Route
        path={`delete`}
        element={<BedroomKindDeleteDialog />}
      />
    </Route>
  </ErrorBoundaryRoutes>
)
