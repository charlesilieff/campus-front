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
import type { IPricing } from 'app/shared/model/pricing.model'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FaArrowLeft, FaSave } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { createEntity, getEntity, reset, updateEntity } from './pricing.reducer'

interface PricingForm {
  wording: string
  price: number
  comment: string
}

export const PricingUpdate = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<'id'>()
  const navigate = useNavigate()
  const isNew = id === undefined
  const pricingEntity = useAppSelector(state => state.pricing.entity)
  const defaultValues = () =>
    isNew ? {} : {
      ...pricingEntity
    }
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<PricingForm>({
    defaultValues: defaultValues()
  })

  const loading = useAppSelector(state => state.pricing.loading)
  const updating = useAppSelector(state => state.pricing.updating)
  const updateSuccess = useAppSelector(state => state.pricing.updateSuccess)

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

  const saveEntity = (values: IPricing) => {
    const entity = {
      ...pricingEntity,
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
        Créez ou modifiez un tarif
      </Heading>

      {loading ? <p>Chargement...</p> : (
        <form onSubmit={handleSubmit(saveEntity)}>
          <VStack minW={'300px'}>
            <FormControl isRequired isInvalid={errors.wording !== undefined}>
              <FormLabel htmlFor="wording" fontWeight={'bold'}>
                {'Nom'}
              </FormLabel>
              <Input
                id="wording"
                type="text"
                placeholder="Nom"
                {...register('wording', {
                  required: 'Le Nom est obligatoire',
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
                {errors.wording && errors.wording.message}
              </FormErrorMessage>
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
