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
import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getParamId } from 'app/lib/util/utils'
import type { BedroomKindEncoded } from 'app/shared/model/bedroom-kind.model'
import { BedroomKind } from 'app/shared/model/bedroom-kind.model'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FaArrowLeft, FaSave } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { schemaResolver } from '../bed/resolver'
import { createEntity, getEntity, reset, updateEntity } from './bedroom-kind.reducer'

export const BedroomKindUpdate = () => {
  const dispatch = useAppDispatch()
  const id = pipe(useParams<'id'>(), ({ id }) => getParamId(id))
  const bedroomKindEntity = useAppSelector(state => state.bedroomKind.entity)
  const isNew = O.isNone(id)
  const defaultValues = () =>
    isNew ? {} : pipe(
      bedroomKindEntity,
      O.map(b => ({
        bedroomKindId: O.getOrElse(() => 0)(b.id),
        name: b.name,
        description: O.getOrElse(b.description, () => '')
      })),
      O.getOrElse(() => ({}))
    )
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset: resetForm
  } = useForm<BedroomKindEncoded>({
    resolver: schemaResolver(BedroomKind)
  })

  useEffect(() => {
    resetForm(defaultValues())
  }, [pipe(bedroomKindEntity, O.map(b => b.id), O.getOrNull)])
  const navigate = useNavigate()

  const loading = useAppSelector(state => state.bedroomKind.loading)
  const updating = useAppSelector(state => state.bedroomKind.updating)
  const updateSuccess = useAppSelector(state => state.bedroomKind.updateSuccess)

  const handleClose = () => {
    navigate('/bedroom-kind')
  }

  useEffect(() => {
    if (isNew && O.isNone(id)) {
      dispatch(reset())
    } else {
      dispatch(getEntity(id.value))
    }
  }, [])

  useEffect(() => {
    if (updateSuccess) {
      handleClose()
    }
  }, [updateSuccess])

  const saveEntity = (values: BedroomKindEncoded) => {
    const entity: BedroomKind = {
      description: O.fromNullable(values.description),
      id: O.fromNullable(values.id),
      name: values.name
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
        {isNew ? 'Créer' : 'Éditer'} un type de chambre
      </Heading>

      {loading ? <p>Chargement...</p> : (
        <form
          onSubmit={handleSubmit(
            saveEntity
          )}
        >
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
