/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Box, Button, Heading, VStack } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar'
import React, { useEffect, useState } from 'react'
import { isEmail, isNumber, ValidatedField, ValidatedForm } from 'react-jhipster'
import { toast } from 'react-toastify'
import { createEntity as createCustomerEntity } from './../../../entities/customer/customer.reducer'
import { handleIntermittentRegister, reset } from './register.reducer'
export const RegisterIntermittentPage = () => {
  const [password, setPassword] = useState('')
  const dispatch = useAppDispatch()

  useEffect(
    () => (): void => {
      dispatch(reset())
    },
    []
  )

  interface SubmitType {
    username: string
    email: string
    firstPassword: string
    firstname: string
    lastname: string
    phoneNumber: string
    age?: number
  }

  const handleValidSubmit = (
    { age, email, firstname, firstPassword, lastname, phoneNumber, username }: SubmitType
  ): void => {
    dispatch(
      handleIntermittentRegister({
        login: username,
        email,
        password: firstPassword,
        langKey: 'en'
      })
    )
    dispatch(
      createCustomerEntity({
        age,
        isFemal: true,
        email,
        firstname,
        lastname,
        phoneNumber
      })
    )
  }

  const updatePassword = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(event.target.value)

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
          Création de votre compte
        </Heading>
      </Box>

      <VStack>
        <Box minW={'500px'}>
          <ValidatedForm
            onSubmit={handleValidSubmit}
          >
            <ValidatedField
              name="username"
              label="Nom d'utilisateur"
              placeholder={"Nom d'utilisateur"}
              validate={{
                required: {
                  value: true,
                  message: "Votre nom d'utilisateur est obligatoire."
                },
                pattern: {
                  value:
                    /^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$/,
                  message: "Votre nom d'utilisateur n'est valide."
                },
                minLength: {
                  value: 2,
                  message: "Votre nom d'utilisateur doit comporter au moins 2 caractère."
                },
                maxLength: {
                  value: 50,
                  message: "Votre nom d'utilisateur ne doit pas comporter plus de 50 caractères."
                }
              }}
              data-cy="username"
            />
            <ValidatedField
              name="email"
              label="Email"
              placeholder={'Votre email'}
              type="email"
              validate={{
                required: {
                  value: true,
                  message: 'Votre email est obligatoire.'
                },
                minLength: {
                  value: 5,
                  message: "Votre email d'utilisateur doit comporter au moins 2 caractère."
                },
                maxLength: {
                  value: 254,
                  message: 'Votre email ne doit pas comporter plus de 254 caractères.'
                },
                validate: v => isEmail(v) || "Votre email n'est pas valide."
              }}
              data-cy="email"
            />
            <ValidatedField
              name="firstPassword"
              label="Nouveau mot de passe"
              placeholder={'Mot de passe'}
              type="password"
              onChange={updatePassword}
              validate={{
                required: {
                  value: true,
                  message: 'Votre mot de passe est obligatoire.'
                },
                minLength: {
                  value: 4,
                  message: 'Votre mot de passe ne doit pas comporter moins de 4 caractères.'
                },
                maxLength: {
                  value: 50,
                  message: 'Votre mot de passe ne doit pas comporter plus de 50 caractères.'
                }
              }}
              data-cy="firstPassword"
            />
            <PasswordStrengthBar password={password} />
            <ValidatedField
              name="secondPassword"
              label="Confirmation du mot de passe"
              placeholder="Confirmez votre mot de passe"
              type="password"
              validate={{
                required: {
                  value: true,
                  message: 'La confirmation du mot de passe est obligatoire.'
                },
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
                  v === password || 'Le mot de passe et la confirmation ne correspondent pas.'
              }}
              data-cy="secondPassword"
            />

            <ValidatedField
              label="Prénom"
              placeholder={'Prénom'}
              id="customer-firstname"
              name="firstname"
              type="text"
              validate={{
                required: { value: true, message: 'This field is required.' },
                minLength: {
                  value: 1,
                  message: 'This field is required to be at least 1 characters.'
                },
                maxLength: {
                  value: 50,
                  message: 'This field cannot be longer than 50 characters.'
                }
              }}
            />
            <ValidatedField
              label="Nom"
              id="customer-lastname"
              name="lastname"
              placeholder={'Nom'}
              data-cy="lastname"
              type="text"
              validate={{
                required: { value: true, message: 'This field is required.' },
                minLength: {
                  value: 1,
                  message: 'This field is required to be at least 1 characters.'
                },
                maxLength: {
                  value: 50,
                  message: 'This field cannot be longer than 50 characters.'
                }
              }}
            />
            <ValidatedField
              label="Age"
              placeholder={'Age'}
              id="customer-age"
              name="age"
              data-cy="age"
              type="number"
              validate={{
                min: { value: 1, message: 'This field should be at least 1.' },
                max: { value: 125, message: 'This field cannot be more than 125.' },
                validate(v) {
                  console.log(v)
                  return isNumber(v as number) || 'This field should be a number.'
                }
              }}
            />
            <ValidatedField
              label="Téléphone"
              id="customer-phoneNumber"
              placeholder={'Téléphone'}
              name="phoneNumber"
              data-cy="phoneNumber"
              type="text"
              validate={{
                required: { value: true, message: 'Le numéro de téléphone est obligatoire.' },
                minLength: { value: 10, message: 'Minimum 10' },
                maxLength: { value: 16, message: 'Maximum 16' }
              }}
            />
            <Button id="register-submit" color="primary" type="submit" data-cy="submit">
              Enregistrez-vous
            </Button>
          </ValidatedForm>
        </Box>
      </VStack>
    </VStack>
  )
}

export default RegisterIntermittentPage
