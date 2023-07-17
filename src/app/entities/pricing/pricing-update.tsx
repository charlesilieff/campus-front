import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  Textarea,
  VStack
} from '@chakra-ui/react'
import * as S from '@effect/schema/Schema'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getEntities as getTypeReservations } from 'app/entities/type-reservation/type-reservation.reducer'
import { getEntities as getUserCategories } from 'app/entities/user-category/user-category.reducer'
import { PricingCreate } from 'app/shared/model/pricing.model'
import { Option as O } from 'effect'
import { pipe } from 'effect'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FaArrowLeft, FaSave } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { schemaResolver } from '../bed/resolver'
import { createEntity, getEntity, reset, updateEntity } from './pricing.reducer'

export const PricingUpdate = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<'id'>()
  const navigate = useNavigate()

  const isNew = id === undefined
  const pricingEntity = useAppSelector(state => state.pricing.entity)
  const userCategories = useAppSelector(state => state.userCategory.entities)
  const typeReservations = useAppSelector(state => state.typeReservation.entities)

  const defaultValues = () =>
    isNew || O.isNone(pricingEntity) ? {} : S.encodeSync(PricingCreate)({
      id: pricingEntity.value.id,
      comment: pricingEntity.value.comment,
      price: pricingEntity.value.price,
      typeReservationId: pipe(pricingEntity.value.typeReservation, O.map(p => p.id)),
      userCategoryId: pipe(pricingEntity.value.userCategory, O.map(p => p.id))
    })

  const {
    handleSubmit,
    register,
    reset: resetForm,
    formState: { errors }
  } = useForm(
    { resolver: schemaResolver(PricingCreate) }
  )
  console.log('errors', errors)
  const loading = useAppSelector(state => state.pricing.loading)
  const updating = useAppSelector(state => state.pricing.updating)
  const updateSuccess = useAppSelector(state => state.pricing.updateSuccess)

  const handleClose = () => {
    navigate('/pricing')
  }
  useEffect(() => {
    resetForm(defaultValues())
  }, [pipe(pricingEntity, O.map(p => p.id), O.getOrNull)])

  useEffect(() => {
    if (isNew) {
      dispatch(reset())
    } else {
      dispatch(getEntity(id))
    }

    dispatch(getUserCategories())
    dispatch(getTypeReservations())
  }, [])

  useEffect(() => {
    if (updateSuccess) {
      handleClose()
    }
  }, [updateSuccess])

  const saveEntity = (values: PricingCreate) => {
    if (isNew) {
      dispatch(createEntity(values))
    } else {
      dispatch(updateEntity(values))
    }
  }

  return (
    <VStack spacing={8}>
      <Heading>
        {isNew ? 'Créez' : 'Modifiez'} un tarif
      </Heading>

      {loading ?
        <p>Chargement...</p> :
        (
          <form onSubmit={handleSubmit(v => saveEntity(v as unknown as PricingCreate))}>
            <VStack minW={'300px'}>
              <FormControl isRequired isInvalid={errors.userCategoryId !== undefined}>
                <FormLabel htmlFor="userCategory" fontWeight={'bold'}>
                  {"Categorie d'utilisateur"}
                </FormLabel>

                <Select
                  id="userCategory"
                  {...register('userCategoryId', {
                    valueAsNumber: true
                  })}
                >
                  <option value="" key="0" />
                  {userCategories ?
                    userCategories.map(userCategory => (
                      <option value={userCategory.id} key={userCategory.id}>
                        {userCategory.name}
                      </option>
                    )) :
                    null}
                </Select>
              </FormControl>

              <FormControl isRequired isInvalid={errors.typeReservationId !== undefined}>
                <FormLabel htmlFor="typeReservation" fontWeight={'bold'}>
                  {'Type de réservation'}
                </FormLabel>
                <Select
                  id="typeReservation"
                  {...register('typeReservationId', {
                    valueAsNumber: true
                  })}
                >
                  <option value="" key="0" />
                  {typeReservations ?
                    typeReservations.map(typeReservation => (
                      <option value={typeReservation.id} key={typeReservation.id}>
                        {typeReservation.name}
                      </option>
                    )) :
                    null}
                </Select>
              </FormControl>

              <FormControl isRequired isInvalid={errors.price !== undefined}>
                <FormLabel htmlFor="price" fontWeight={'bold'}>
                  {'Prix'}
                </FormLabel>
                <Input
                  id="price"
                  type="number"
                  placeholder="Prix"
                  {...register('price', {
                    required: 'Le prix est obligatoire',
                    min: { value: 0, message: 'This field should be at least 0.' }
                  })}
                />

                <FormErrorMessage>
                  {errors.price && errors.price.message}
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
                  to="/pricing"
                  variant={'back'}
                  leftIcon={<FaArrowLeft />}
                >
                  Retour
                </Button>

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
