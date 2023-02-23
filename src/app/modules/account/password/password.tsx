/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Button, Heading, VStack } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { PasswordStrengthBar } from 'app/shared/layout/password/password-strength-bar'
import { getSession } from 'app/shared/reducers/authentication'
import React, { useEffect, useState } from 'react'
import { FaSave } from 'react-icons/fa'
import { ValidatedField, ValidatedForm } from 'react-jhipster'
import { toast } from 'react-toastify'

import { reset, savePassword } from './password.reducer'

export const Password = () => {
  const [password, setPassword] = useState('')
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(reset())
    dispatch(getSession())
    return () => {
      dispatch(reset())
    }
  }, [])

  const handleValidSubmit = ({ currentPassword, newPassword }) => {
    dispatch(savePassword({ currentPassword, newPassword }))
  }

  const updatePassword = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(event.target.value)

  const account = useAppSelector(state => state.authentication.account)
  const successMessage = useAppSelector(state => state.password.successMessage)
  const errorMessage = useAppSelector(state => state.password.errorMessage)

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage)
    } else if (errorMessage) {
      toast.success(errorMessage)
    }
  }, [successMessage, errorMessage])

  return (
    <VStack>
      <Heading>Mot de passe pour {account.login}</Heading>
      <VStack p={8}>
        <ValidatedForm id="password-form" onSubmit={handleValidSubmit}>
          <ValidatedField
            name="currentPassword"
            label="Mot de passe actuel"
            placeholder={'Mot de passe actuel'}
            type="password"
            validate={{
              required: { value: true, message: 'Your password is required.' }
            }}
            data-cy="currentPassword"
          />
          <ValidatedField
            name="newPassword"
            label="Nouveau mot de passe"
            placeholder={'Nouveau mot de passe'}
            type="password"
            validate={{
              required: { value: true, message: 'Your password is required.' },
              minLength: {
                value: 4,
                message: 'Your password is required to be at least 4 characters.'
              },
              maxLength: {
                value: 50,
                message: 'Your password cannot be longer than 50 characters.'
              }
            }}
            onChange={updatePassword}
            data-cy="newPassword"
          />
          <PasswordStrengthBar password={password} />
          <ValidatedField
            name="confirmPassword"
            label="Confirmation du nouveau mot de passe"
            placeholder="Confirmation du nouveau mot de passe"
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
            data-cy="confirmPassword"
          />
          <Button variant={'save'} type="submit" leftIcon={<FaSave />}>
            Enregistrer
          </Button>
        </ValidatedForm>
      </VStack>
    </VStack>
  )
}
