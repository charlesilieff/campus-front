import { Button, Heading, VStack } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import type { ICustomer } from 'app/shared/model/customer.model'
import React, { useEffect } from 'react'
import { FaSave } from 'react-icons/fa'
import { isNumber, ValidatedField, ValidatedForm } from 'react-jhipster'
import { useParams } from 'react-router-dom'

import { getEntity, reset, setData } from './reservation-request.reducer'

export const CustomerUpdate = () => {
  const dispatch = useAppDispatch()
  const { uuid } = useParams<'uuid'>()

  const isNew = uuid === undefined

  const customerEntity = useAppSelector(state => state.requestReservation.entity.customer)
  const loading = useAppSelector(state => state.requestReservation.loading)

  useEffect(() => {
    if (isNew) {
      dispatch(reset())
    } else {
      dispatch(getEntity(uuid))
    }
  }, [])

  const saveCustomer = (values: ICustomer) => {
    const entity = {
      customer: {
        ...customerEntity,
        ...values,
        // @ts-expect-error : age is "" if not set
        age: values.age === '' ? undefined : values.age
      }
    }

    dispatch(setData(entity))
  }

  const defaultValues = () => customerEntity

  return (
    <VStack>
      <Heading size={'md'}>
        {isNew ? 'Créez' : 'Modifiez'} votre demande de réservation : informations de contact
      </Heading>

      {loading ? <p>Chargement...</p> : (
        <ValidatedForm
          defaultValues={defaultValues()}
          onSubmit={e => saveCustomer(e)}
        >
          <ValidatedField
            label="Prénom"
            id="customer-firstname"
            name="firstname"
            data-cy="firstname"
            type="text"
            validate={{
              required: { value: true, message: 'Ce champ est obligatoire.' },
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
            data-cy="lastname"
            type="text"
            validate={{
              required: { value: true, message: 'Ce champ est obligatoire.' },
              minLength: { value: 1, message: 'Minimum 1' },
              maxLength: { value: 50, message: 'Maximum 50' }
            }}
          />
          <ValidatedField
            label="Age"
            id="customer-age"
            name="age"
            data-cy="age"
            type="number"
            validate={{
              min: { value: 1, message: 'Minimum 1' },
              max: { value: 125, message: 'Maximum 125' },
              validate: v => isNumber(v) || 'Ce doit être un nombre.'
            }}
          />

          <ValidatedField
            label="Téléphone"
            id="customer-phoneNumber"
            name="phoneNumber"
            data-cy="phoneNumber"
            type="tel"
            validate={{
              required: { value: true, message: 'Le numéro de téléphone est obligatoire.' },
              minLength: { value: 10, message: 'Minimum 10' },
              maxLength: { value: 16, message: 'Maximum 16' }
            }}
          />
          <ValidatedField
            label="Email"
            id="customer-email"
            name="email"
            data-cy="email"
            type="email"
            validate={{
              required: { value: true, message: "L'adresse email est obligatoire." },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Adresse email invalide.'
              }
            }}
          />
          &nbsp;
          <Button variant={'save'} type="submit" leftIcon={<FaSave />}>
            Suivant
          </Button>
        </ValidatedForm>
      )}
    </VStack>
  )
}
