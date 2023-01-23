import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route'
import React from 'react'
import { Switch } from 'react-router-dom'

import Pricing from './pricing'
import PricingDeleteDialog from './pricing-delete-dialog'
import PricingDetail from './pricing-detail'
import PricingUpdate from './pricing-update'

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={PricingUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={PricingUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={PricingDetail} />
      <ErrorBoundaryRoute path={match.url} component={Pricing} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={PricingDeleteDialog} />
  </>
)

export default Routes
