import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Bed from './bed';
import BedDetail from './bed-detail';
import BedUpdate from './bed-update';
import BedDeleteDialog from './bed-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={BedUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={BedUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={BedDetail} />
      <ErrorBoundaryRoute path={match.url} component={Bed} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={BedDeleteDialog} />
  </>
);

export default Routes;
