import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  VStack
} from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const successMessage: string = useAppSelector(state => state.settings.successMessage)

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
        ...account,
        ...values
      })
    )
  }
  useEffect(() => {
    resetForm(account)
  }, [account.id])
  return (
    <VStack>
      <Heading size={'md'}>User settings for {account.login}</Heading>
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
