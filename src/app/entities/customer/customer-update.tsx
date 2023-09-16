import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Textarea,
  VStack
} from '@chakra-ui/react'
import * as S from '@effect/schema/Schema'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import type { CustomerDecoded, CustomerEncoded } from 'app/shared/model/customer.model'
import { Customer } from 'app/shared/model/customer.model'
import { Option as O } from 'effect'
import { pipe } from 'effect'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FaArrowLeft, FaSave } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { schemaResolver } from '../bed/resolver'
import { createEntity, getCustomer, reset, updateEntity } from './customer.reducer'

export const CustomerUpdate = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const { id } = useParams<'id'>()
  const navigate = useNavigate()
  const isNew = id === undefined
  const customerEntity = useAppSelector(state => state.customer.entity)
  const defaultValues = (customer: O.Option<CustomerDecoded>) =>
    isNew || !O.isSome(customer) ? {} : S.encodeSync(Customer)(customer.value)
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset: resetForm
  } = useForm<CustomerEncoded>(
    {
      resolver: schemaResolver(Customer)
    }
  )

  useEffect(() => {
    resetForm(defaultValues(customerEntity))
  }, [pipe(customerEntity, O.map(b => b.id), O.getOrNull)])

  const loading = useAppSelector(state => state.customer.loading)
  const updating = useAppSelector(state => state.customer.updating)
  const updateSuccess = useAppSelector(state => state.customer.updateSuccess)

  const handleClose = (): void => {
    navigate('/customer')
  }

  useEffect(() => {
    if (isNew) {
      dispatch(reset())
    } else {
      dispatch(getCustomer(id))
    }
  }, [])

  useEffect(() => {
    if (updateSuccess) {
      handleClose()
    }
  }, [updateSuccess])

  const saveEntity = (values: CustomerDecoded) => {
    if (isNew) {
      dispatch(createEntity(values))
    } else {
      dispatch(updateEntity(values))
    }
  }

  return (
    <VStack spacing={8}>
      <Heading>
        {isNew ? 'Créez un client.' : "Modifiez les informations d'un client"}
      </Heading>

      {loading ? <p>Chargement...</p> : (
        <form
          onSubmit={handleSubmit(c => saveEntity(c as unknown as CustomerDecoded))}
        >
          <VStack spacing={4}>
            <FormControl isRequired isInvalid={errors.firstName !== undefined}>
              <FormLabel htmlFor="firstName" fontWeight={'bold'}>
                {'Prénom'}
              </FormLabel>
              <Input
                id="firstName"
                type="text"
                placeholder="Prénom"
                {...register('firstName', {
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
                {errors.firstName && errors.firstName.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={errors.lastName !== undefined}>
              <FormLabel htmlFor="lastName" fontWeight={'bold'}>
                {'Nom'}
              </FormLabel>
              <Input
                id="lastName"
                type="text"
                placeholder="Nom"
                {...register('lastName', {
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
                {errors.lastName && errors.lastName.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.age !== undefined}>
              <FormLabel htmlFor="age" fontWeight={'bold'}>
                {'Âge'}
              </FormLabel>
              <Input
                id="age"
                type="number"
                placeholder="Age"
                {...register('age', {
                  valueAsNumber: true
                })}
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
                id="phoneNumber"
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
            <FormControl isInvalid={errors.comment !== undefined}>
              <FormLabel htmlFor="comment" fontWeight={'bold'}>
                {'Commentaire'}
              </FormLabel>
              <Textarea
                id="comment"
                placeholder="Commentaire"
                {...register('comment', {})}
              />

              <FormErrorMessage>
                {errors.comment && errors.comment.message}
              </FormErrorMessage>
            </FormControl>
            <HStack>
              <Button
                as={Link}
                variant="back"
                to="/customer"
                leftIcon={<FaArrowLeft />}
              >
                Retour
              </Button>
              &nbsp;
              <Button
                variant="save"
                type="submit"
                isLoading={updating}
                leftIcon={<FaSave />}
              >
                Sauvegarder
              </Button>
            </HStack>
          </VStack>
        </form>
      )}
    </VStack>
  )
}
