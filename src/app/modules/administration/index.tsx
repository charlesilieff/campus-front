import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route'
import React from 'react'

import Configuration from './configuration/configuration'
import Docs from './docs/docs'
import Health from './health/health'
import Logs from './logs/logs'
import Metrics from './metrics/metrics'
import UserManagement from './user-management'

const Routes = ({ match }) => (
  <div>
    <ErrorBoundaryRoute path={`${match.url}/user-management`} component={UserManagement} />
    <ErrorBoundaryRoute exact path={`${match.url}/health`} component={Health} />
    <ErrorBoundaryRoute exact path={`${match.url}/metrics`} component={Metrics} />
    <ErrorBoundaryRoute exact path={`${match.url}/configuration`} component={Configuration} />
    <ErrorBoundaryRoute exact path={`${match.url}/logs`} component={Logs} />
    <ErrorBoundaryRoute exact path={`${match.url}/docs`} component={Docs} />
  </div>
)

export default Routes
