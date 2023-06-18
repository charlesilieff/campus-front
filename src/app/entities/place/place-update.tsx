import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  Textarea,
  VStack
} from '@chakra-ui/react'
import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import * as S from '@effect/schema/Schema'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import type { PlaceEncoded } from 'app/shared/model/place.model'
import { PlaceNoImage } from 'app/shared/model/place.model'
import { Place } from 'app/shared/model/place.model'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaArrowLeft, FaSave } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { schemaResolver } from '../bed/resolver'
import { findOnePlaceById, reset, savePlace, updateEntity } from './place.reducer'
import { openFile, setFileData } from './utils'

export const PlaceUpdate = () => {
  const [image, setImage] = useState<O.Option<string>>(O.none())
  const [imageContentType, setImageContentType] = useState<O.Option<string>>(O.none())
  const dispatch = useAppDispatch()
  const { id } = useParams<'id'>()
  const navigate = useNavigate()
  const isNew = id === undefined
  const clearBlob = () => {
    setImage(O.none())
    setImageContentType(O.none())
  }
  const placeEntity = useAppSelector(state => state.place.entity)

  const defaultValues = () =>
    isNew || O.isNone(placeEntity) ? {} : S.encode(Place)(placeEntity.value)
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset: resetForm
  } = useForm<PlaceEncoded>({
    resolver: schemaResolver(PlaceNoImage)
  })

  useEffect(() => {
    resetForm(defaultValues())
    setImage(O.flatMap(placeEntity, p => p.image))
    setImageContentType(O.flatMap(placeEntity, p => p.imageContentType))
  }, [pipe(placeEntity, O.map(b => b.id), O.getOrNull)])

  const loading = useAppSelector(state => state.place.loading)
  const updating = useAppSelector(state => state.place.updating)
  const updateSuccess = useAppSelector(state => state.place.updateSuccess)

  const handleClose = () => {
    navigate('/place')
  }

  useEffect(() => {
    if (isNew) {
      dispatch(reset())
    } else {
      dispatch(findOnePlaceById(id))
    }
  }, [])

  useEffect(() => {
    if (updateSuccess) {
      handleClose()
    }
  }, [updateSuccess])

  const saveEntity = (values: PlaceNoImage) => {
    const place = {
      comment: values.comment,
      id: values.id,
      image,
      imageContentType,
      name: values.name,
      intermittentAllowed: pipe(placeEntity, O.flatMap(p => p.intermittentAllowed))
    }
    if (isNew) {
      dispatch(savePlace(place))
    } else {
      dispatch(updateEntity(place))
    }
  }

  return (
    <VStack spacing={8}>
      <Heading>
        {isNew ? 'Créer' : 'Éditer'} un lieu
      </Heading>

      {loading ?
        <p>Chargement...</p> :
        (
          <form onSubmit={handleSubmit(d => saveEntity(d as unknown as PlaceNoImage))}>
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
              <FormControl isInvalid={errors.image !== undefined}>
                <FormLabel htmlFor="image" fontWeight={'bold'}>
                  {'Image'}
                </FormLabel>
                {O.isSome(image) && O.isSome(imageContentType) ?
                  (
                    <HStack
                      p={4}
                      alignItems="flex-end"
                      justifyContent={'space-between'}
                    >
                      <Image
                        cursor="pointer"
                        onClick={openFile(imageContentType.value, image.value)}
                        src={`data:${imageContentType.value};base64,${image.value}`}
                        style={{ maxHeight: '100px' }}
                      />

                      <Button color="white" backgroundColor={'red'} size="sm" onClick={clearBlob}>
                        <strong>&nbsp;x&nbsp;</strong>
                      </Button>
                    </HStack>
                  ) :
                  null}

                <Input
                  id="image"
                  type={'file'}
                  accept="image/*"
                  {...register('image', {
                    onChange(e: React.ChangeEvent<HTMLInputElement>) {
                      setFileData(
                        e,
                        (contentType, data) => {
                          setImage(O.some(data.toString()))
                          setImageContentType(O.some(contentType.toString()))
                        }
                      )
                    }
                  })}
                />

                <FormErrorMessage>
                  {errors.image && errors.image.message}
                </FormErrorMessage>
              </FormControl>
              <HStack>
                <Button
                  as={Link}
                  variant="back"
                  to="/place"
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
