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
import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import * as A from '@effect/data/ReadonlyArray'
import * as S from '@effect/schema/Schema'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getEntities as getBedroomKinds } from 'app/entities/bedroom-kind/bedroom-kind.reducer'
import { findAllPlaces } from 'app/entities/place/place.reducer'
import type { Room, RoomCreateDecoded, RoomCreateEncoded } from 'app/shared/model/room.model'
import { RoomCreate } from 'app/shared/model/room.model'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FaArrowLeft, FaSave } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { schemaResolver } from '../bed/resolver'
import { createEntity, getEntity, reset, updateEntity } from './room.reducer'

export const RoomUpdate = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { id } = useParams<'id'>()
  const isNew = id === undefined
  const places = useAppSelector(state => state.place.entities)
  const bedroomKinds = pipe(
    useAppSelector(state => state.bedroomKind.entities),
    A.filterMap(b => O.struct({ id: b.id, name: O.some(b.name) }))
  )
  const roomEntity = useAppSelector(state => state.room.entity)

  const defaultValues = (room: O.Option<Room>) =>
    isNew || !O.isSome(room) ? {} : S.encode(RoomCreate)({
      id: O.some(room.value.id),
      bedroomKindId: O.isSome(room.value.bedroomKind) ? room.value.bedroomKind.value.id : O.none(),
      comment: room.value.comment,
      name: room.value.name,
      placeId: O.isSome(room.value.place) ? O.some(room.value.place.value.id) : O.none()
    })
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset: resetForm
  } = useForm<RoomCreateEncoded>({
    resolver: schemaResolver(RoomCreate)
  })

  useEffect(() => {
    resetForm(defaultValues(roomEntity))
  }, [pipe(roomEntity, O.map(b => b.id), O.getOrNull)])

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

    dispatch(findAllPlaces())
    dispatch(getBedroomKinds())
  }, [])

  useEffect(() => {
    if (updateSuccess) {
      handleClose()
    }
  }, [updateSuccess])

  const saveEntity = (values: RoomCreateDecoded) => {
    console.log(values)
    if (isNew) {
      dispatch(createEntity(values))
    } else {
      dispatch(updateEntity(values))
    }
  }

  return (
    <VStack>
      <Heading>
        {isNew ? 'Créer' : 'Éditer'} une chambre
      </Heading>

      {loading ? <p>Chargement...</p> : (
        <form
          onSubmit={handleSubmit(v => {
            console.log(v)
            return saveEntity(v as unknown as RoomCreateDecoded)
          })}
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
              <FormLabel htmlFor="place" fontWeight={'bold'}>
                {'Lieu'}
              </FormLabel>

              <Select
                id="placeId"
                {...register('placeId', { valueAsNumber: true })}
              >
                <option value={undefined}>Aucun lieu</option>
                {places ?
                  pipe(
                    places,
                    A.map(place => (
                      <option value={place.id.toString()} key={place.id}>
                        {place.name}
                      </option>
                    ))
                  ) :
                  null}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="bedroomKind" fontWeight={'bold'}>
                {'Type de chambre'}
              </FormLabel>

              <Select
                id="bedroomKindId"
                {...register('bedroomKindId', { valueAsNumber: true })}
              >
                <option value={undefined}>Aucune type de chambre</option>
                {bedroomKinds ?
                  pipe(
                    bedroomKinds,
                    A.map(bedroomKind => (
                      <option
                        value={bedroomKind.id.toString()}
                        key={bedroomKind.id}
                      >
                        {bedroomKind.name}
                      </option>
                    ))
                  ) :
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
