import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { isEmail, ValidatedField, ValidatedForm } from 'react-jhipster'
import { toast } from 'react-toastify'
import { Alert, Button, Col, Row } from 'reactstrap'

import { handlePasswordResetInit, reset } from '../password-reset.reducer'

export const PasswordResetInit = () => {
  const dispatch = useAppDispatch()

  useEffect(
    () => () => {
      dispatch(reset())
    },
    []
  )

  const handleValidSubmit = ({ email }: { email: string }) => {
    dispatch(handlePasswordResetInit(email))
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const successMessage: string = useAppSelector(state => state.passwordReset.successMessage)

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage)
    }
  }, [successMessage])

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h1>Réinitialiser votre mot de passe</h1>
          <Alert color="warning">
            <p>{"Saisissez l'adresse électronique que vous avez utilisée pour vous inscrire"}</p>
          </Alert>
          <ValidatedForm onSubmit={handleValidSubmit}>
            <ValidatedField
              name="email"
              label="Email"
              placeholder={'Votre email'}
              type="email"
              validate={{
                required: { value: true, message: 'Your email is required.' },
                minLength: {
                  value: 5,
                  message: 'Your email is required to be at least 5 characters.'
                },
                maxLength: {
                  value: 254,
                  message: 'Your email cannot be longer than 50 characters.'
                },
                validate: v => isEmail(v) || 'Your email is invalid.'
              }}
              data-cy="emailResetPassword"
            />
            <Button color="primary" type="submit" data-cy="submit">
              Réinitialiser le mot de passe
            </Button>
          </ValidatedForm>
        </Col>
      </Row>
    </div>
  )
}
