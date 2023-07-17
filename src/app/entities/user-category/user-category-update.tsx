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
import { UserCategory } from 'app/shared/model/userCategory.model'
import { Option as O } from 'effect'
import { pipe } from 'effect'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FaArrowLeft, FaSave } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { schemaResolver } from '../bed/resolver'
import { createEntity, getEntity, reset, updateEntity } from './user-category.reducer'

export const UserCategoryUpdate = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<'id'>()
  const navigate = useNavigate()
  const isNew = id === undefined
  const userCategoryEntity = useAppSelector(state => state.userCategory.entity)

  const defaultValues = () =>
    isNew || O.isNone(userCategoryEntity) ?
      {} :
      S.encodeSync(UserCategory)(userCategoryEntity.value)
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset: resetForm
  } = useForm({
    resolver: schemaResolver(UserCategory)
  })

  useEffect(() => {
    resetForm(defaultValues())
  }, [pipe(userCategoryEntity, O.map(u => u.id), O.getOrNull)])

  const loading = useAppSelector(state => state.userCategory.loading)
  const updating = useAppSelector(state => state.userCategory.updating)
  const updateSuccess = useAppSelector(state => state.userCategory.updateSuccess)

  const handleClose = () => {
    navigate('/pricing')
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

  const saveEntity = (values: UserCategory) => {
    if (isNew) {
      dispatch(createEntity(values))
    } else {
      dispatch(updateEntity(values))
    }
  }

  return (
    <VStack spacing={8}>
      <Heading>
        {isNew ? 'Créer' : 'Éditer'} une catégorie d&apos;utilisateur
      </Heading>

      {loading ?
        <p>Chargement...</p> :
        (
          <form onSubmit={handleSubmit(v => saveEntity(v as unknown as UserCategory))}>
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
