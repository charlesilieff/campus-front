import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { useAppSelector } from 'app/config/store';

import CustomerUpdate from './customer-request-update';
import ReservationUpdate from './reservation-request-update';

export const DemandUpdate = (props: RouteComponentProps<{ id: string }>) => {
  const stepOne = useAppSelector(state => state.requestReservation.stepOne);

  return (
    <div>
      {!stepOne ? (
        <CustomerUpdate history={props.history} location={props.location} match={props.match} />
      ) : (
        <ReservationUpdate history={props.history} location={props.location} match={props.match} />
      )}
    </div>
  );
};

export default DemandUpdate;
