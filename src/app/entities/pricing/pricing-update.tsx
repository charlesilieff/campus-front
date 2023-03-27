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
  // Tooltip,
  VStack
} from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getEntities as getTypeReservations } from 'app/entities/type-reservation/type-reservation.reducer'
import { getEntities as getUserCategories } from 'app/entities/user-category/user-category.reducer'
import type { IPricing } from 'app/shared/model/pricing.model'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FaArrowLeft, FaSave } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { createEntity, getEntity, reset, updateEntity } from './pricing.reducer'

interface PricingForm {
  // wording: string
  price: number
  comment: string
  userCategoryId: string
  // userCategoryId: string
  typeReservationId: string
}

export const PricingUpdate = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<'id'>()
  const navigate = useNavigate()

  const isNew = id === undefined
  const pricingEntity = useAppSelector(state => state.pricing.entity)
  const userCategories = useAppSelector(state => state.userCategory.entities)
  const typeReservations = useAppSelector(state => state.typeReservation.entities)

  const defaultValues = () =>
    isNew ? {} : {
      ...pricingEntity,
      userCategoryId: pricingEntity?.userCategory?.id,
      typeReservationId: pricingEntity?.typeReservation?.id
      // userCategoryId: pricingEntity?.userCategory?.id === '' ?
      //   undefined :
      //   pricingEntity?.userCategory?.id
      // typeReservationId: pricingEntity?.typeReservation?.id === '' ? // todo fix this number
      //   undefined :
      //   pricingEntity?.typeReservation?.id
    }

  const {
    handleSubmit,
    register,
    reset: resetForm,
    formState: { errors }
  } = useForm<PricingForm>()

  const loading = useAppSelector(state => state.pricing.loading)
  const updating = useAppSelector(state => state.pricing.updating)
  const updateSuccess = useAppSelector(state => state.pricing.updateSuccess)

  const handleClose = () => {
    navigate('/pricing')
  }
  useEffect(() => {
    resetForm(defaultValues())
  }, [pricingEntity.id])

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

  interface ExtendIPricingForTheBAckendToBeDeleted extends IPricing {
    userCategoryId: string
    typeReservationId: string
  }

  const saveEntity = (values: ExtendIPricingForTheBAckendToBeDeleted) => {
    const entity = {
      ...pricingEntity,
      ...values,
      userCategoryId: values.userCategoryId === '' ? undefined : values.userCategoryId,
      userCategory: userCategories.find(userCategory =>
        userCategory.id.toString() === values.userCategoryId.toString()
      ),
      typeReservationId: values.typeReservationId === '' ? undefined : values.typeReservationId,
      typeReservation: typeReservations.find(typeReservation =>
        typeReservation.id.toString() === values.typeReservationId.toString()
      )
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
        {isNew ? 'Créez' : 'Modifiez'} un tarif
      </Heading>

      {loading ? <p>Chargement...</p> : (
        <form onSubmit={handleSubmit(saveEntity)}>
          <VStack minW={'300px'}>
            <FormControl>
              <FormLabel htmlFor="userCategory" fontWeight={'bold'}>
                {"Categorie d'utilisateur"}
              </FormLabel>

              <Select
                id="userCategory"
                {...register('userCategoryId', {})}
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

            <FormControl>
              <FormLabel htmlFor="typeReservation" fontWeight={'bold'}>
                {'Type de réservation'}
              </FormLabel>
              <Select
                id="typeReservation"
                {...register('typeReservationId', {})}
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
