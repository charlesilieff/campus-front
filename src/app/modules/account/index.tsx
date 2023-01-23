import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route'
import React from 'react'

import Password from './password/password'
import Settings from './settings/settings'

const Routes = ({ match }) => (
  <div>
    <ErrorBoundaryRoute path={`${match.url}/settings`} component={Settings} />
    <ErrorBoundaryRoute path={`${match.url}/password`} component={Password} />
  </div>
)

export default Routes
