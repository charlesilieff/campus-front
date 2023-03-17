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
import type { ICustomer } from 'app/shared/model/customer.model'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FaSave } from 'react-icons/fa'
import { useParams } from 'react-router-dom'

import { getEntity, reset, setData } from './reservation-request.reducer'

export const CustomerUpdate = () => {
  const customerEntity = useAppSelector(state => state.requestReservation.entity.customer)
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset: resetForm
  } = useForm<ICustomer>({})

  useEffect(() => {
    resetForm(defaultValues())
  }, [customerEntity?.id])
  const dispatch = useAppDispatch()
  const { uuid } = useParams<'uuid'>()

  const isNew = uuid === undefined

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
        <form onSubmit={handleSubmit(saveCustomer)}>
          <VStack minW={'300px'}>
            <FormControl isRequired isInvalid={errors.lastname !== undefined}>
              <FormLabel htmlFor="firstname" fontWeight={'bold'}>
                {'Prénom'}
              </FormLabel>
              <Input
                id="firstname"
                type="text"
                placeholder="Prénom"
                {...register('firstname', {
                  required: 'Le prénom est obligatoire',
                  minLength: {
                    value: 1,
                    message: 'This field is required to be at least 1 characters.'
                  },
                  maxLength: {
                    value: 50,
                    message: 'This field cannot be longer than 50 characters.'
                  }
                })}
              />

              <FormErrorMessage>
                {errors.firstname && errors.firstname.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={errors.lastname !== undefined}>
              <FormLabel htmlFor="lastname" fontWeight={'bold'}>
                {'Nom'}
              </FormLabel>
              <Input
                type="text"
                placeholder="Nom"
                {...register('lastname', {
                  required: 'Le nom est obligatoire',
                  minLength: {
                    value: 1,
                    message: 'This field is required to be at least 1 characters.'
                  },
                  maxLength: {
                    value: 50,
                    message: 'This field cannot be longer than 50 characters.'
                  }
                })}
              />

              <FormErrorMessage>
                {errors.lastname && errors.lastname.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.age !== undefined}>
              <FormLabel htmlFor="age" fontWeight={'bold'}>
                {'Age'}
              </FormLabel>
              <Input
                type="number"
                placeholder="Age"
                {...register('age', {})}
              />

              <FormErrorMessage>
                {errors.age && errors.age.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.phoneNumber !== undefined}>
              <FormLabel htmlFor="phoneNumber" fontWeight={'bold'}>
                {'Téléphone'}
              </FormLabel>
              <Input
                type="text"
                placeholder="Téléphone"
                {...register('phoneNumber', {})}
              />

              <FormErrorMessage>
                {errors.phoneNumber && errors.phoneNumber.message}
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
                    value: 1,
                    message: 'This field is required to be at least 1 characters.'
                  },
                  maxLength: {
                    value: 50,
                    message: 'This field cannot be longer than 50 characters.'
                  }
                })}
              />

              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>

            <Button variant={'save'} type="submit" leftIcon={<FaSave />}>
              Suivant
            </Button>
          </VStack>
        </form>
      )}
    </VStack>
  )
}
