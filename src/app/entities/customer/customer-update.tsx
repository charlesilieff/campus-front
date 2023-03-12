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
import { useAppDispatch, useAppSelector } from 'app/config/store'
import type { ICustomer } from 'app/shared/model/customer.model'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FaArrowLeft, FaSave } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { createEntity, getEntity, reset, updateEntity } from './customer.reducer'

interface CustomerForm {
  firstname: string
  lastname: string
  age: number
  phoneNumber: string
  email: string
  comment: string
}
export const CustomerUpdate = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const { id } = useParams<'id'>()
  const navigate = useNavigate()
  const isNew = id === undefined
  const customerEntity = useAppSelector(state => state.customer.entity)
  const defaultValues = () =>
    isNew ? {} : {
      ...customerEntity
    }
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset: resetForm
  } = useForm<CustomerForm>()

  useEffect(() => {
    resetForm(defaultValues())
  }, [customerEntity.id])

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
      dispatch(getEntity(id))
    }
  }, [])

  useEffect(() => {
    if (updateSuccess) {
      handleClose()
    }
  }, [updateSuccess])

  const saveEntity = (values: CustomerForm) => {
    const entity: ICustomer = {
      ...customerEntity,
      ...values,
      // @ts-expect-error : age is a number
      age: values.age === '' ? 0 : values.age
    }
    console.log(entity)
    if (isNew) {
      dispatch(createEntity(entity))
    } else {
      dispatch(updateEntity(entity))
    }
  }

  return (
    <VStack spacing={8}>
      <Heading>
        {isNew ? 'Créez un client.' : "Modifiez les informations d'un client"}
      </Heading>

      {loading ? <p>Chargement...</p> : (
        <form
          onSubmit={handleSubmit(saveEntity)}
        >
          <VStack spacing={4}>
            <FormControl isRequired isInvalid={errors.firstname !== undefined}>
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
                id="lastname"
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
                id="age"
                type="number"
                placeholder="Age"
                {...register('age', {})}
              />

              <FormErrorMessage>
                {errors.age && errors.age.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={errors.phoneNumber !== undefined}>
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
