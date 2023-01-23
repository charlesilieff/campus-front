import { useAppSelector } from 'app/config/store'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import ReservationBedsUpdate from './reservation_beds-update'
import ReservationCustomerUpdate from './reservation_customer-update'

export const ReservationUpdate = (props: RouteComponentProps<{ id: string }>) => {
  const stepOne = useAppSelector(state => state.bookingBeds.stepOne)

  return (
    <div>
      {!stepOne ?
        (
          <ReservationCustomerUpdate
            history={props.history}
            location={props.location}
            match={props.match}
          />
        ) :
        (
          <ReservationBedsUpdate
            history={props.history}
            location={props.location}
            match={props.match}
          />
        )}
    </div>
  )
}

export default ReservationUpdate
