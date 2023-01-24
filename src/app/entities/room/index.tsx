import { ErrorBoundaryRoutes } from 'app/shared/error/error-boundary-routes'
import React from 'react'
import { Route } from 'react-router-dom'

import Room from './room'
import RoomDeleteDialog from './room-delete-dialog'
import RoomDetail from './room-detail'
import RoomUpdate from './room-update'

export const RoomRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route path={`new`} element={<RoomUpdate />} />
    <Route index element={<Room />} />
    <Route path=":id">
      <Route path={`edit`} element={<RoomUpdate />} />
      <Route index element={<RoomDetail />} />
      <Route path={`delete`} element={<RoomDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
)
