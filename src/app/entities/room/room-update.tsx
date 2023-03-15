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
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getEntities as getBedroomKinds } from 'app/entities/bedroom-kind/bedroom-kind.reducer'
import { getEntities as getPlaces } from 'app/entities/place/place.reducer'
import type { IRoom } from 'app/shared/model/room.model'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FaArrowLeft, FaSave } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { createEntity, getEntity, reset, updateEntity } from './room.reducer'

interface RoomForm {
  name: string
  comment: string
  placeId: number
  bedroomKindId: number
}

export const RoomUpdate = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { id } = useParams<'id'>()
  const isNew = id === undefined
  const places = useAppSelector(state => state.place.entities)
  const bedroomKinds = useAppSelector(state => state.bedroomKind.entities)
  const roomEntity = useAppSelector(state => state.room.entity)
  const defaultValues = () =>
    isNew ? {} : {
      ...roomEntity,
      placeId: roomEntity?.place?.id,
      bedroomKindId: roomEntity?.bedroomKind?.id
    }
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset: resetForm
  } = useForm<RoomForm>({})

  useEffect(() => {
    resetForm(defaultValues())
  }, [roomEntity.id])

  const loading = useAppSelector(state => state.room.loading)
  const updating = useAppSelector(state => state.room.updating)
  const updateSuccess = useAppSelector(state => state.room.updateSuccess)

  const handleClose = () => {
    navigate('/room')
  }

  useEffect(() => {
    if (isNew) {
      dispatch(reset())
    } else {
      dispatch(getEntity(id))
    }

    dispatch(getPlaces())
    dispatch(getBedroomKinds())
  }, [])

  useEffect(() => {
    if (updateSuccess) {
      handleClose()
    }
  }, [updateSuccess])

  interface ExtendIRoomForTheBAckendToBeDeleted extends IRoom {
    placeId: string | number
    bedroomKindId: string | number
  }

  const saveEntity = (values: ExtendIRoomForTheBAckendToBeDeleted) => {
    const entity: ExtendIRoomForTheBAckendToBeDeleted = {
      ...roomEntity,
      ...values,
      // this is so bad
      placeId: values.placeId === '' ? undefined : values.placeId,
      bedroomKindId: values.bedroomKindId === '' ? undefined : values.bedroomKindId,
      place: places.find(it => it.id.toString() === values.placeId.toString()),
      bedroomKind: bedroomKinds.find(it => it.id.toString() === values.bedroomKindId.toString())
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
        {isNew ? 'Créer' : 'Éditer'} une chambre
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
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="room" fontWeight={'bold'}>
                {'Lieu'}
              </FormLabel>

              <Select
                id="room"
                {...register('placeId', {})}
              >
                <option value="" key="0" />
                {places ?
                  places.map(place => (
                    <option value={place.id} key={place.id}>
                      {place.name}
                    </option>
                  )) :
                  null}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="bedroomKind" fontWeight={'bold'}>
                {'Type de chambre'}
              </FormLabel>

              <Select
                id="bedroomKind"
                {...register('bedroomKindId', {})}
              >
                <option value="" key="0" />
                {bedroomKinds ?
                  bedroomKinds.map(bedroomKind => (
                    <option value={bedroomKind.id} key={bedroomKind.id}>
                      {bedroomKind.name}
                    </option>
                  )) :
                  null}
              </Select>
            </FormControl>
            <HStack>
              <Button
                as={Link}
                to="/room"
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
