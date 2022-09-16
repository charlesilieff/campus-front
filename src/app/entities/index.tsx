import React from 'react';
import { Switch } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Customer from './customer'; 
import Pricing from './pricing';
import Bed from './bed';
import Room from './room';
import BedroomKind from './bedroom-kind';
import Planning from './planning';
import Place from './place';
import ReservationNotConfirmed from './reservation/reservation_nobeds_notconfirmed';
import BookingBeds from './bookingbeds';
import Reservation from './reservation';
import ReservationLunchOnly from './reservation/reservation_isLunchOnly';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={'/reservation/not-confirmed'} component={ReservationNotConfirmed} />
      <ErrorBoundaryRoute path={'/reservation/lunch-only'} component={ReservationLunchOnly} />
      <ErrorBoundaryRoute path={`${match.url}bookingbeds`} component={BookingBeds} />
      <ErrorBoundaryRoute path={`${match.url}reservation`} component={Reservation} />
      <ErrorBoundaryRoute path={`${match.url}customer`} component={Customer} />
      <ErrorBoundaryRoute path={`${match.url}pricing`} component={Pricing} />
      <ErrorBoundaryRoute path={`${match.url}bed`} component={Bed} />
      <ErrorBoundaryRoute path={`${match.url}room`} component={Room} />
      <ErrorBoundaryRoute path={`${match.url}bedroom-kind`} component={BedroomKind} />
      <ErrorBoundaryRoute path={`${match.url}planning`} component={Planning} />
      <ErrorBoundaryRoute path={`${match.url}place`} component={Place} />

      {/* jhipster-needle-add-route-path - JHipster will add routes here */}
    </Switch>
  </div>
);

export default Routes;
