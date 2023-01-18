import React from 'react'
import { Switch } from 'react-router-dom'

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route'

import Room from './room'
import RoomDeleteDialog from './room-delete-dialog'
import RoomDetail from './room-detail'
import RoomUpdate from './room-update'

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={RoomUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={RoomUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={RoomDetail} />
      <ErrorBoundaryRoute path={match.url} component={Room} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={RoomDeleteDialog} />
  </>
)

export default Routes
