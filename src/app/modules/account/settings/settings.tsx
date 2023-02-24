import { Button, Heading, VStack } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import type { IUser } from 'app/shared/model/user.model'
import { getSession } from 'app/shared/reducers/authentication'
import React, { useEffect } from 'react'
import { FaSave } from 'react-icons/fa'
import { isEmail, ValidatedField, ValidatedForm } from 'react-jhipster'
import { toast } from 'react-toastify'

import { reset, saveAccountSettings } from './settings.reducer'

export const Settings = () => {
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

  return (
    <VStack>
      <Heading size={'md'}>User settings for {account.login}</Heading>
      <ValidatedForm id="settings-form" onSubmit={handleValidSubmit} defaultValues={account}>
        <ValidatedField
          name="firstName"
          label="Prénom"
          id="firstName"
          placeholder="Prénom"
          validate={{
            required: { value: true, message: 'Prénom is required.' },
            minLength: {
              value: 1,
              message: 'Prénom is required to be at least 1 character'
            },
            maxLength: {
              value: 50,
              message: 'Prénom cannot be longer than 50 characters'
            }
          }}
          data-cy="firstname"
        />
        <ValidatedField
          name="lastName"
          label="Nom"
          id="lastName"
          placeholder="Votre nom"
          validate={{
            required: { value: true, message: 'Your nom is required.' },
            minLength: {
              value: 1,
              message: 'Your nom is required to be at least 1 character'
            },
            maxLength: {
              value: 50,
              message: 'Your nom cannot be longer than 50 characters'
            }
          }}
          data-cy="lastname"
        />
        <ValidatedField
          name="email"
          label="Email"
          placeholder={'Your email'}
          type="email"
          validate={{
            required: { value: true, message: 'Your email is required.' },
            minLength: {
              value: 5,
              message: 'Your email is required to be at least 5 characters.'
            },
            maxLength: {
              value: 254,
              message: 'Your email cannot be longer than 50 characters.'
            },
            validate: v => isEmail(v) || 'Your email is invalid.'
          }}
          data-cy="email"
        />
        <Button variant={'save'} type="submit" leftIcon={<FaSave />}>
          Save
        </Button>
      </ValidatedForm>
    </VStack>
  )
}
