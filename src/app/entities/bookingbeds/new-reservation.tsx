import { useAppSelector } from 'app/config/store'
import React from 'react'

import { ReservationBedsUpdate } from './reservation_beds-update'
import { ReservationCustomerUpdate } from './reservation_customer-update'

export const BookingBedsUpdate = () => {
  const stepOne = useAppSelector(state => state.bookingBeds.stepOne)

  return (
    <div>
      {!stepOne ? <ReservationCustomerUpdate /> : <ReservationBedsUpdate />}
    </div>
  )
}
