import React, { useEffect } from 'react'
import { getUrlParameter } from 'react-jhipster'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Alert, Col, Row } from 'reactstrap'

import { useAppDispatch, useAppSelector } from 'app/config/store'
import { activateAction, reset } from './activate.reducer'

const successAlert = (
  <Alert color="success">
    <strong>Votre compte a bien été activé.</strong> S&apos;il-vous-plaît{' '}
    <Link to="/login" className="alert-link">
      connectez-vous
    </Link>
    .
  </Alert>
)

const failureAlert = (
  <Alert color="danger">
    <strong>Your user could not be activated.</strong> Please use the registration form to sign up.
  </Alert>
)

export const ActivatePage = (props: RouteComponentProps<{ key: any }>) => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const key = getUrlParameter('key', props.location.search)
    dispatch(activateAction(key))
    return () => {
      dispatch(reset())
    }
  }, [])

  const { activationSuccess, activationFailure } = useAppSelector(state => state.activate)

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h1>Activation</h1>
          {activationSuccess ? successAlert : undefined}
          {activationFailure ? failureAlert : undefined}
        </Col>
      </Row>
    </div>
  )
}

export default ActivatePage
