import { useAppDispatch, useAppSelector } from 'app/config/store'
import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar'
import React, { useEffect, useState } from 'react'
import { getUrlParameter, ValidatedField, ValidatedForm } from 'react-jhipster'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Col, Row } from 'reactstrap'

import { handlePasswordResetFinish, reset } from '../password-reset.reducer'

export const PasswordResetFinishPage = (props: RouteComponentProps<{ key: string }>) => {
  const [password, setPassword] = useState('')
  const [key] = useState(getUrlParameter('key', props.location.search))
  const dispatch = useAppDispatch()

  useEffect(
    () => () => {
      dispatch(reset())
    },
    []
  )
  const history = useHistory()

  const handleValidSubmit = ({ newPassword }) => {
    dispatch(handlePasswordResetFinish({ key, newPassword }))
    history.push('/login')
  }

  const updatePassword = event => setPassword(event.target.value)

  const getResetForm = () => {
    return (
      <ValidatedForm onSubmit={handleValidSubmit}>
        <ValidatedField
          name="newPassword"
          label="New password"
          placeholder={'New password'}
          type="password"
          validate={{
            required: { value: true, message: 'Your password is required.' },
            minLength: {
              value: 4,
              message: 'Your password is required to be at least 4 characters.'
            },
            maxLength: { value: 50, message: 'Your password cannot be longer than 50 characters.' }
          }}
          onChange={updatePassword}
          data-cy="resetPassword"
        />
        <PasswordStrengthBar password={password} />
        <ValidatedField
          name="confirmPassword"
          label="New password confirmation"
          placeholder="Confirm the new password"
          type="password"
          validate={{
            required: { value: true, message: 'Your confirmation password is required.' },
            minLength: {
              value: 4,
              message: 'Your confirmation password is required to be at least 4 characters.'
            },
            maxLength: {
              value: 50,
              message: 'Your confirmation password cannot be longer than 50 characters.'
            },
            validate: v => v === password || 'The password and its confirmation do not match!'
          }}
          data-cy="confirmResetPassword"
        />
        <Button color="success" type="submit" data-cy="submit">
          Valider le nouveau mot de passe
        </Button>
      </ValidatedForm>
    )
  }

  const successMessage = useAppSelector(state => state.passwordReset.successMessage)

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage)
    }
  }, [successMessage])

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="4">
          <h1>Reset password</h1>
          <div>{key ? getResetForm() : null}</div>
        </Col>
      </Row>
    </div>
  )
}

export default PasswordResetFinishPage
