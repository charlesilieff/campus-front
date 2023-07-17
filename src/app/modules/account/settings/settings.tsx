import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  useToast,
  VStack
} from '@chakra-ui/react'
import * as S from '@effect/schema/Schema'
import { AUTHORITIES } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { schemaResolver } from 'app/entities/bed/resolver'
import { hasAnyAuthority } from 'app/shared/auth/private-route'
import { getSession } from 'app/shared/reducers/authentication'
import { Option as O } from 'effect'
import { pipe } from 'effect'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FaSave } from 'react-icons/fa'

import { reset, saveAccountSettings } from './settings.reducer'

const UserForm = S.struct({
  firstName: S.string,
  lastName: S.string,
  email: S.string,
  receiveMailReservation: S.boolean
})

type UserForm = S.To<typeof UserForm>

export const Settings = () => {
  const toast = useToast()
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset: resetForm
  } = useForm<UserForm>({
    resolver: schemaResolver(UserForm)
  })
  const dispatch = useAppDispatch()
  const account = useAppSelector(state => state.authentication.account)

  const isRespHebergement = useAppSelector(state =>
    hasAnyAuthority(state.authentication.account, [AUTHORITIES.RESPHEBERGEMENT])
  )

  const successMessage = useAppSelector(state => state.settings.successMessage)

  useEffect(() => {
    dispatch(getSession())
    return () => {
      dispatch(reset())
    }
  }, [])

  useEffect(() => {
    if (O.isSome(successMessage)) {
      toast({
        position: 'top',
        title: successMessage.value,
        status: 'success',
        duration: 4000,
        isClosable: true
      })
    }
  }, [successMessage])

  const handleValidSubmit = (values: UserForm) => {
    pipe(
      account,
      O.map(a => ({
        ...a,
        firstName: O.some(values.firstName),
        lastName: O.some(values.lastName),
        email: values.email,
        receiveMailReservation: O.some(values.receiveMailReservation)
      })),
      O.map(v =>
        dispatch(
          saveAccountSettings(v)
        )
      )
    )
  }
  useEffect(() => {
    pipe(
      account,
      O.map(a =>
        resetForm({
          email: a.email,
          firstName: a.firstName !== undefined ? O.getOrElse(a.firstName, () => '') : '',
          lastName: a.lastName !== undefined ? O.getOrElse(a.lastName, () => '') : '',
          receiveMailReservation: O.getOrElse(a.receiveMailReservation, () => true)
        })
      )
    )
  }, [pipe(account, O.map(a => a.id), O.getOrNull)])
  return (
    <VStack>
      <Heading size={'md'}>
        Modifier utilisateur {pipe(account, O.map(a => a.login), O.getOrUndefined)}
      </Heading>
      <form
        onSubmit={handleSubmit(handleValidSubmit)}
      >
        <VStack spacing={4}>
          <FormControl isInvalid={errors.firstName !== undefined}>
            <FormLabel htmlFor="firstName" fontWeight={'bold'}>
              {'Prénom'}
            </FormLabel>
            <Input
              id="firstName"
              type="text"
              placeholder="Prénom"
              {...register('firstName', {
                maxLength: {
                  value: 50,
                  message: 'Ce champ doit faire moins de 50 caractères.'
                }
              })}
            />

            <FormErrorMessage>
              {errors.lastName && errors.lastName.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.lastName !== undefined}>
            <FormLabel htmlFor="lastName" fontWeight={'bold'}>
              {'Nom'}
            </FormLabel>
            <Input
              id="lastName"
              type="text"
              placeholder="Nom"
              {...register('lastName', {
                maxLength: {
                  value: 50,
                  message: 'Ce champ doit faire moins de 50 caractères.'
                }
              })}
            />

            <FormErrorMessage>
              {errors.lastName && errors.lastName.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={errors.email !== undefined}>
            <FormLabel htmlFor="email" fontWeight={'bold'}>
              {'Email'}
            </FormLabel>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              {...register('email', {
                required: "L'email est obligatoire",
                minLength: {
                  value: 4,
                  message: 'This field is required to be at least 4 characters.'
                }
              })}
            />

            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>

          {isRespHebergement
            && (
              <FormControl isInvalid={errors.receiveMailReservation !== undefined}>
                <FormLabel htmlFor="receiveMailReservation" fontWeight={'bold'}>
                  {'Je souhaite recevoir les emails de réservation'}
                </FormLabel>
                <Checkbox
                  id="receiveMailReservation"
                  type="checkbox"
                  placeholder="reception des emails de réservation"
                  {...register('receiveMailReservation')}
                />

                <FormErrorMessage>
                  {errors.receiveMailReservation && errors.receiveMailReservation.message}
                </FormErrorMessage>
              </FormControl>
            )}

          <HStack>
            <Button
              variant="save"
              type="submit"
              leftIcon={<FaSave />}
            >
              Sauvegarder
            </Button>
          </HStack>
        </VStack>
      </form>
    </VStack>
  )
}
