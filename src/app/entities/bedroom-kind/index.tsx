import React from 'react'
import { Switch } from 'react-router-dom'

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route'

import BedroomKind from './bedroom-kind'
import BedroomKindDeleteDialog from './bedroom-kind-delete-dialog'
import BedroomKindDetail from './bedroom-kind-detail'
import BedroomKindUpdate from './bedroom-kind-update'

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={BedroomKindUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={BedroomKindUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={BedroomKindDetail} />
      <ErrorBoundaryRoute path={match.url} component={BedroomKind} />
    </Switch>
    <ErrorBoundaryRoute
      exact
      path={`${match.url}/:id/delete`}
      component={BedroomKindDeleteDialog}
    />
  </>
)

export default Routes
