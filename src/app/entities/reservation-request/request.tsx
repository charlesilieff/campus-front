import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import CustomerDetail from './request-detail'
import RequestUpdate from './request-update'

export const ReservationRequestUpdate = (props: RouteComponentProps<{ id: string }>) => {
  return (
    <RequestUpdate history={props.history} location={props.location} match={props.match}>
    </RequestUpdate>
  )
}

export const ReservationRequestDetail = (props: RouteComponentProps<{ id: string }>) => {
  return (
    <CustomerDetail history={props.history} location={props.location} match={props.match}>
    </CustomerDetail>
  )
}
