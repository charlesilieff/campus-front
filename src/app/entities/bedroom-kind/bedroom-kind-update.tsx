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
import * as S from '@effect/schema/Schema'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import type { BedroomKindDecoded } from 'app/shared/model/bedroom-kind.model'
import { BedroomKindCreate } from 'app/shared/model/bedroom-kind.model'
import { getParamId } from 'app/shared/util/utils'
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
    isNew || O.isNone(bedroomKindEntity) ? {} : S.encode(BedroomKindCreate)(bedroomKindEntity.value)
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset: resetForm
  } = useForm({
    resolver: schemaResolver(BedroomKindCreate)
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

  const saveEntity = (values: BedroomKindDecoded) => {
    if (isNew) {
      dispatch(createEntity(values))
    } else {
      dispatch(updateEntity(values))
    }
  }

  const toto = S.struct({
    name: S.string,
    description: S.optional(S.string).toOption()
  })

  const totoToEncode = {
    name: 'toto',
    description: O.some('toto')
  }
  const totoToDecode = {
    name: 'toto'
  }

  const test = S.encode(toto)(totoToEncode)
  const test2 = S.decode(toto)(totoToDecode)
  console.log(test)
  console.log(test2)

  return (
    <VStack>
      <Heading>
        {isNew ? 'Créer' : 'Éditer'} un type de chambre
      </Heading>

      {loading ? <p>Chargement...</p> : (
        <form
          onSubmit={handleSubmit(data => saveEntity(data as unknown as BedroomKindDecoded))}
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
