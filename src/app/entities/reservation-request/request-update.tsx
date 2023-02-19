import { useAppSelector } from 'app/config/store'
import React from 'react'

import { CustomerUpdate } from './customer-request-update'
import { ReservationUpdate } from './reservation-request-update'

export const DemandUpdate = (): JSX.Element => {
  const stepOne = useAppSelector(state => state.requestReservation.stepOne)

  return (
    <div>
      {!stepOne ? <CustomerUpdate /> : <ReservationUpdate />}
    </div>
  )
}
