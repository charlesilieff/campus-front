import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  VStack
} from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { PasswordStrengthBar } from 'app/shared/layout/password/password-strength-bar'
import React, { useEffect, useRef } from 'react'
import type { FieldValues } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { handlePasswordResetFinish, reset } from '../password-reset.reducer'

export const PasswordResetFinish = () => {
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors }
  } = useForm<{ newPassword: string; secondPassword: string }>({})
  const dispatch = useAppDispatch()

  const [searchParams] = useSearchParams()
  const key = searchParams.get('key')

  const password = useRef({})
  password.current = watch('newPassword', '')

  useEffect(
    () => () => {
      dispatch(reset())
    },
    []
  )

  const handleValidSubmit = ({ newPassword }: FieldValues) =>
    dispatch(handlePasswordResetFinish({ key, newPassword }))

  const getResetForm = () => (<form
    onSubmit={handleSubmit(handleValidSubmit)}
  >
    <VStack spacing={4} alignItems={'flex-start'}>
      <FormControl isRequired isInvalid={errors.newPassword !== undefined}>
        <FormLabel htmlFor="newPassword">Nouveau mot de passe</FormLabel>
        <Input
          placeholder="Nouveau mot de passe"
          type="password"
          {...register('newPassword', {
            required: { value: true, message: 'Votre mot de passe est requis.' },
            minLength: {
              value: 4,
              message: 'Votre mot de passe doit comporter au moins 4 caractères.'
            },
            maxLength: {
              value: 50,
              message: 'Votre mot de passe ne doit pas comporter plus de 50 caractères.'
            }
          })}
        />
        <FormErrorMessage>
          {errors.newPassword && errors.newPassword.message}
        </FormErrorMessage>
      </FormControl>
      <PasswordStrengthBar password={password.current} />
      <FormControl isRequired isInvalid={errors.secondPassword !== undefined}>
        <FormLabel htmlFor="secondPassword">Confirmation du mot de passe</FormLabel>
        <Input
          id="secondPassword"
          placeholder="Confirmez votre mot de passe"
          type="password"
          {...register('secondPassword', {
            required: 'La confirmation du mot de passe est obligatoire.',
            minLength: {
              value: 4,
              message:
                'Votre confirmation de mot de passe ne doit pas comporter moins de 4 caractères.'
            },
            maxLength: {
              value: 50,
              message:
                'Votre confirmation de mot de passe ne doit pas comporter plus de 50 caractères.'
            },
            validate: v =>
              v === password.current
              || 'Le mot de passe et la confirmation ne correspondent pas.'
          })}
        />
        <FormErrorMessage>
          {errors.secondPassword && errors.secondPassword.message}
        </FormErrorMessage>
      </FormControl>

      <Button variant={'save'} type="submit">
        Réinitialiser le mot de passe
      </Button>
    </VStack>
  </form>)

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const successMessage: string | null = useAppSelector(state => state.passwordReset.successMessage)

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage)
    }
  }, [successMessage])

  return (
    <VStack>
      <Heading size={'md'}>Réinitialisation du mot de passe</Heading>
      <div>{key ? getResetForm() : null}</div>
    </VStack>
  )
}
