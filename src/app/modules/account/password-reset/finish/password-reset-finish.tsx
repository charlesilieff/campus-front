import { Button, Heading, VStack } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { PasswordStrengthBar } from 'app/shared/layout/password/password-strength-bar'
import React, { useEffect, useState } from 'react'
import type { FieldValues } from 'react-hook-form'
import { ValidatedField, ValidatedForm } from 'react-jhipster'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { handlePasswordResetFinish, reset } from '../password-reset.reducer'

export const PasswordResetFinish = () => {
  const dispatch = useAppDispatch()

  const [searchParams] = useSearchParams()
  const key = searchParams.get('key')

  const [password, setPassword] = useState('')

  useEffect(
    () => () => {
      dispatch(reset())
    },
    []
  )

  const handleValidSubmit = ({ newPassword }: FieldValues) =>
    dispatch(handlePasswordResetFinish({ key, newPassword }))

  const updatePassword = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(event.target.value)

  const getResetForm = () => (<ValidatedForm onSubmit={handleValidSubmit}>
    <ValidatedField
      name="newPassword"
      label="Nouveau mot de passe"
      placeholder="Nouveau mot de passe"
      type="password"
      validate={{
        required: { value: true, message: 'Votre mot de passe est requis.' },
        minLength: {
          value: 4,
          message: 'Votre mot de passe doit comporter au moins 4 caractères.'
        },
        maxLength: {
          value: 50,
          message: 'Votre mot de passe ne doit pas comporter plus de 50 caractères.'
        }
      }}
      onChange={updatePassword}
      data-cy="resetPassword"
    />
    <PasswordStrengthBar password={password} />
    <ValidatedField
      name="confirmPassword"
      label="Confirmation du nouveau mot de passe"
      placeholder="Confirmation du nouveau mot de passe"
      type="password"
      validate={{
        required: { value: true, message: 'Votre confirmation du mot de passe est requise.' },
        minLength: {
          value: 4,
          message: 'Votre confirmation du mot de passe doit comporter au moins 4 caractères.'
        },
        maxLength: {
          value: 50,
          message: 'Votre confirmation du mot de passe ne doit pas comporter plus de 50 caractères.'
        },
        validate: v =>
          v === password || 'Le nouveau mot de passe et sa confirmation ne sont pas égaux !'
      }}
      data-cy="confirmResetPassword"
    />
    <Button variant={'save'} type="submit">
      Réinitialiser le mot de passe
    </Button>
  </ValidatedForm>)

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const successMessage: string | null = useAppSelector(state => state.passwordReset.successMessage)

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage)
    }
  }, [successMessage])

  return (
    <VStack>
      <Heading>Réinitialisation du mot de passe</Heading>
      <div>{key ? getResetForm() : null}</div>
    </VStack>
  )
}
