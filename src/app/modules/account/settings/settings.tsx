import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  VStack
} from '@chakra-ui/react'
import { AUTHORITIES } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { hasAnyAuthority } from 'app/shared/auth/private-route'
import type { IUser } from 'app/shared/model/user.model'
import { getSession } from 'app/shared/reducers/authentication'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FaSave } from 'react-icons/fa'
import { toast } from 'react-toastify'

import { reset, saveAccountSettings } from './settings.reducer'

interface UserForm {
  firstName: string
  lastName: string
  email: string
  receiveMailReservation: boolean
}

export const Settings = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset: resetForm
  } = useForm<UserForm>({})
  const dispatch = useAppDispatch()
  const account: IUser = useAppSelector(state => state.authentication.account)
  const accountModify: IUser = {
    ...account,
    receiveMailReservation: account.receiveMailReservation === undefined ?
      true :
      account.receiveMailReservation
  }

  const isRespHebergement = useAppSelector(state =>
    hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.RESPHEBERGEMENT])
  )

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment
  const successMessage: string | null = useAppSelector(state => state.settings.successMessage)

  useEffect(() => {
    dispatch(getSession())
    return () => {
      dispatch(reset())
    }
  }, [])

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage)
    }
  }, [successMessage])

  const handleValidSubmit = (values: IUser) => {
    dispatch(
      saveAccountSettings({
        ...accountModify,
        ...values
      })
    )
  }
  useEffect(() => {
    resetForm(accountModify)
  }, [accountModify.id])
  return (
    <VStack>
      <Heading size={'md'}>Modifier utilisateur {accountModify.login}</Heading>
      <form
        // @ts-expect-error TODO: fix this
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
                  {'Je souhaite recevoir les emails de resérvation'}
                </FormLabel>
                <Checkbox
                  id="receiveMailReservation"
                  type="checkbox"
                  placeholder="reception des emails de resérvation"
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
