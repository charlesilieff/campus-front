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
import type { ITypeReservation } from 'app/shared/model/typeReservation.model'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FaArrowLeft, FaSave } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { createEntity, getEntity, reset, updateEntity } from './type-reservation.reducer'

interface TypeReservationForm {
  name?: string
  comment?: string
}

export const TypeReservationUpdate = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<'id'>()
  const navigate = useNavigate()
  const isNew = id === undefined
  const typeReservationEntity = useAppSelector(state => state.typeReservation.entity)

  const defaultValues = (): TypeReservationForm =>
    isNew ? {} : {
      ...typeReservationEntity
    }
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset: resetForm
  } = useForm<TypeReservationForm>({})

  useEffect(() => {
    resetForm(defaultValues())
  }, [typeReservationEntity.id])

  const loading = useAppSelector(state => state.typeReservation.loading)
  const updating = useAppSelector(state => state.typeReservation.updating)
  const updateSuccess = useAppSelector(state => state.typeReservation.updateSuccess)

  const handleClose = () => {
    navigate('/pricing')
    // navigate('/type-reservation')
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

  const saveEntity = (values: TypeReservationForm) => {
    const entity: ITypeReservation = {
      ...typeReservationEntity,
      ...values
    }

    if (isNew) {
      dispatch(createEntity(entity))
    } else {
      dispatch(updateEntity(entity))
    }
  }

  return (
    <VStack spacing={8}>
      <Heading>
        {isNew ? 'Créer' : 'Éditer'} un type de réservation
      </Heading>

      {loading ? <p>Chargement...</p> : (
        <form onSubmit={handleSubmit(saveEntity)}>
          <VStack minW={'300px'}>
            <FormControl isRequired isInvalid={errors.name !== undefined}>
              <FormLabel htmlFor="name" fontWeight={'bold'}>
                {'Nom'}
              </FormLabel>
              <Input
                id="name"
                type="text"
                placeholder="Nom"
                {...register('name', {
                  required: 'Le nom est obligatoire',
                  minLength: {
                    value: 2,
                    message: 'This field is required to be at least 2 characters.'
                  },
                  maxLength: {
                    value: 20,
                    message: 'This field cannot be longer than 20 characters.'
                  }
                })}
              />{' '}
              <FormErrorMessage>
                {errors.name && errors.name.message}
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
                // to="/type-reservation"
                to="/pricing"
                leftIcon={<FaArrowLeft />}
              >
                Retour
              </Button>

              <Button
                variant="save"
                type="submit"
                disabled={updating}
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