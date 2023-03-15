/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
import { getSession } from 'app/shared/reducers/authentication'
import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { FaSave } from 'react-icons/fa'
import { toast } from 'react-toastify'

import { reset, savePassword } from './password.reducer'

interface PasswordForm {
  currentPassword: string
  newPassword: string
  secondPassword: string
}

export const Password = () => {
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors }
  } = useForm<PasswordForm>({})
  const password = useRef({})
  password.current = watch('newPassword', '')
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(reset())
    dispatch(getSession())
    return () => {
      dispatch(reset())
    }
  }, [])
  interface PasswordCompare {
    currentPassword: string
    newPassword: string
  }

  const handleValidSubmit = ({ currentPassword, newPassword }: PasswordCompare) => {
    dispatch(savePassword({ currentPassword, newPassword }))
  }

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
      <Heading size="md">Mot de passe pour {account.login}</Heading>

      <VStack p={8}>
        <form
          onSubmit={handleSubmit(handleValidSubmit)}
        >
          <VStack spacing={4} alignItems={'flex-start'}>
            <FormControl isRequired isInvalid={errors.currentPassword !== undefined}>
              <FormLabel htmlFor="currentPassword">Mot de passe actuel</FormLabel>
              <Input
                placeholder="Mot de passe actuel"
                type="password"
                {...register('currentPassword', {
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
                {errors.currentPassword && errors.currentPassword.message}
              </FormErrorMessage>
            </FormControl>
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

            <Button variant={'save'} type="submit" leftIcon={<FaSave />}>
              Enregistrer
            </Button>
          </VStack>
        </form>
      </VStack>
    </VStack>
  )
}
