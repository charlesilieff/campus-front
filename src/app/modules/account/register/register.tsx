import {
  Box,
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
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { handleRegister, reset } from './register.reducer'

interface FormValues {
  username: string
  email: string
  firstPassword: string
  secondPassword: string
}

export const RegisterPage = () => {
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = React.useState(false)
  const navigate = useNavigate()
  useEffect(
    () => () => {
      dispatch(reset())
    },
    []
  )
  const {
    handleSubmit,
    watch,
    register,
    formState: { errors }
  } = useForm<FormValues>()
  const handleValidSubmit = async ({ username, email, firstPassword }) => {
    setIsLoading(true)
    await dispatch(
      handleRegister({
        login: username,
        email,
        password: firstPassword,
        langKey: 'en'
      })
    )
    setIsLoading(false)
    navigate('/')
  }

  const password = useRef({})
  password.current = watch('firstPassword', '')
  const successMessage = useAppSelector(state => state.register.successMessage)

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage)
    }
  }, [successMessage])

  return (
    <VStack>
      <Box>
        <Heading size={'md'}>
          {"Création d'un compte"}
        </Heading>
      </Box>
      <Box minW={'500px'}>
        <form
          onSubmit={handleSubmit(handleValidSubmit)}
        >
          <FormControl isRequired isInvalid={errors.username !== undefined} mb={4}>
            <FormLabel htmlFor="username">{"Nom d'utilisateur"}</FormLabel>
            <Input
              id="username"
              type="text"
              placeholder="Nom d'utilisateur"
              {...register('username', {
                required: "Votre nom d'utilisateur est obligatoire.",
                minLength: {
                  value: 2,
                  message: "Votre nom d'utilisateur doit comporter au moins 2 caractères."
                },
                maxLength: {
                  value: 50,
                  message: "Votre nom d'utilisateur ne doit pas comporter plus de 50 caractères."
                },
                pattern: {
                  value:
                    /^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$/,
                  message: "Votre nom d'utilisateur n'est valide."
                }
              })}
            />{' '}
            <FormErrorMessage>
              {errors.username && errors.username.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={errors.email !== undefined} mb={4}>
            <FormLabel htmlFor="email">Email</FormLabel>
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

          <FormControl isRequired isInvalid={errors.firstPassword !== undefined} mb={4}>
            <FormLabel htmlFor="firstPassword">Nouveau mot de passe</FormLabel>
            <Input
              id="firstPassword"
              placeholder="Mot de passe"
              type="password"
              {...register('firstPassword', {
                required: 'Votre mot de passe est obligatoire.',
                minLength: {
                  value: 4,
                  message: 'Votre mot de passe ne doit pas comporter moins de 4 caractères.'
                },
                maxLength: {
                  value: 50,
                  message: 'Votre mot de passe ne doit pas comporter plus de 50 caractères.'
                }
              })}
            />
            <FormErrorMessage>
              {errors.firstPassword && errors.firstPassword.message}
            </FormErrorMessage>
          </FormControl>
          <PasswordStrengthBar password={password.current} />
          <FormControl isRequired isInvalid={errors.secondPassword !== undefined} mb={10}>
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
          <Button colorScheme={'green'} type="submit" isLoading={isLoading}>
            Enregistrez-vous
          </Button>
        </form>
      </Box>
    </VStack>
  )
}
