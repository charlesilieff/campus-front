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
import type { IBedroomKind } from 'app/shared/model/bedroom-kind.model'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FaArrowLeft, FaSave } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { createEntity, getEntity, reset, updateEntity } from './bedroom-kind.reducer'

interface BedroomKindForm {
  bedroomKindId: string
  name: string
  description: string
}

export const BedroomKindUpdate = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<'id'>()
  const bedroomKindEntity = useAppSelector(state => state.bedroomKind.entity)
  const isNew = id === undefined
  const defaultValues = () =>
    isNew ? {} : {
      ...bedroomKindEntity
    }
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<BedroomKindForm>({
    defaultValues: defaultValues()
  })

  const navigate = useNavigate()

  const loading = useAppSelector(state => state.bedroomKind.loading)
  const updating = useAppSelector(state => state.bedroomKind.updating)
  const updateSuccess = useAppSelector(state => state.bedroomKind.updateSuccess)

  const handleClose = () => {
    navigate('/bedroom-kind')
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

  const saveEntity = (values: IBedroomKind) => {
    const entity = {
      ...bedroomKindEntity,
      ...values
    }

    if (isNew) {
      dispatch(createEntity(entity))
    } else {
      dispatch(updateEntity(entity))
    }
  }

  return (
    <VStack>
      <Heading>
        Créez ou modifiez un type de chambre
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
                    message: 'This field is required to be at least 4 characters.'
                  },
                  maxLength: {
                    value: 20,
                    message: 'This field cannot be longer than 20 characters.'
                  }
                })}
              />

              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.description !== undefined}>
              <FormLabel htmlFor="description" fontWeight={'bold'}>
                {'Description'}
              </FormLabel>
              <Input
                id="description"
                type="textarea"
                placeholder="Description"
                {...register('description', {})}
              />

              <FormErrorMessage>
                {errors.description && errors.description.message}
              </FormErrorMessage>
            </FormControl>
            <HStack>
              <Button
                as={Link}
                to="/bedroom-kind"
                variant={'back'}
                leftIcon={<FaArrowLeft />}
              >
                Retour
              </Button>
              &nbsp;
              <Button
                variant={'save'}
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
