import {
  Alert,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  useToast,
  VStack
} from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { handlePasswordResetInit, reset } from '../password-reset.reducer'

export const PasswordResetInit = () => {
  const toast = useToast()
  const dispatch = useAppDispatch()
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<{ email: string }>()
  useEffect(
    () => () => {
      dispatch(reset())
    },
    []
  )

  const handleValidSubmit = ({ email }: { email: string }) => {
    dispatch(handlePasswordResetInit(email))
  }
  // @ts-expect-error TODO: fix this
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment
  const successMessage: string = useAppSelector(state => state.passwordReset.successMessage)

  useEffect(() => {
    if (successMessage) {
      toast({
        position: 'top',
        title: successMessage,
        status: 'success',
        duration: 4000,
        isClosable: true
      })
    }
  }, [successMessage])

  return (
    <VStack spacing={8} alignItems="flex-start" maxW="600">
      <Heading size={'lg'}>Réinitialiser votre mot de passe</Heading>
      <Alert status="warning" w={'100%'}>
        {"Saisissez l'adresse électronique que vous avez utilisée pour vous inscrire"}
      </Alert>

      <form
        onSubmit={handleSubmit(handleValidSubmit)}
      >
        <FormControl isRequired isInvalid={errors.email !== undefined} mb={4}>
          <FormLabel htmlFor="email" fontWeight={'bold'}>Email</FormLabel>
          <Input
            id="email"
            type="email"
            placeholder="Email"
            {...register('email', {
              required: 'Votre email est obligatoire.',
              minLength: {
                value: 5,
                message: "Votre email d'utilisateur doit comporter au moins 5 caractères."
              },
              maxLength: {
                value: 254,
                message: 'Votre email ne doit pas comporter plus de 254 caractères.'
              },
              pattern: {
                value: /^[^@]+@[^@]+\.[^@]+$/,
                message: "Votre email n'est pas valide."
              }
            })}
          />
          <FormErrorMessage>
            {errors.email && errors.email.message}
          </FormErrorMessage>
        </FormControl>

        <Button variant={'save'} type="submit">
          Réinitialiser le mot de passe
        </Button>
      </form>
    </VStack>
  )
}
