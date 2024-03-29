import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  Tooltip,
  VStack
} from '@chakra-ui/react'
import * as S from '@effect/schema/Schema'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getEntities as getRooms } from 'app/entities/room/room.reducer'
import type { Bed, BedCreateDecoded } from 'app/shared/model/bed.model'
import { BedCreate } from 'app/shared/model/bed.model'
import { Option as O } from 'effect'
import { pipe } from 'effect'
import React, { useEffect } from 'react'
import type { UseFormHandleSubmit } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { FaArrowLeft, FaSave } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { createEntity, getEntity, reset, updateEntity } from './bed.reducer'
import { schemaResolver } from './resolver'

export const BedUpdate = () => {
  const bedEntity = useAppSelector(state => state.bed.entity)

  const id = pipe(useParams<'id'>(), ({ id }) => O.fromNullable(id), O.map(Number))
  const isNew = O.isNone(id)
  const defaultValues = (bed: O.Option<Bed>) =>
    isNew || !O.isSome(bed) ? {} : S.encodeSync(BedCreate)({
      id: O.some(bed.value.id),
      kind: bed.value.kind,
      number: bed.value.number,
      numberOfPlaces: +bed.value.numberOfPlaces,
      roomId: O.isSome(bed.value.room) ? O.some(bed.value.room.value.id) : O.none()
    })
  const rooms = useAppSelector(state => state.room.entities)
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset: resetForm
  } = useForm({
    resolver: schemaResolver(BedCreate)
  })
  useEffect(() => {
    resetForm(defaultValues(bedEntity))
  }, [pipe(bedEntity, O.map(b => b.id), O.getOrNull), rooms])
  const handleSubmit2 = handleSubmit as unknown as UseFormHandleSubmit<BedCreateDecoded>
  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  const loading = useAppSelector(state => state.bed.loading)
  const updating = useAppSelector(state => state.bed.updating)
  const updateSuccess = useAppSelector(state => state.bed.updateSuccess)

  const handleClose = () => {
    navigate('/bed')
  }

  useEffect(() => {
    if (isNew || !O.isSome(id)) {
      dispatch(reset())
    } else {
      dispatch(getEntity(id.value))
    }

    dispatch(getRooms())
  }, [])

  useEffect(() => {
    if (updateSuccess) {
      handleClose()
    }
  }, [updateSuccess])

  const saveEntity = (values: BedCreateDecoded) => {
    if (isNew) {
      dispatch(createEntity(values))
    } else {
      dispatch(updateEntity(values))
    }
  }

  return (
    <VStack spacing={8}>
      <Heading>
        {isNew ? 'Créez' : 'Modifiez'} un lit
      </Heading>

      {loading ? <p>Chargement...</p> : (
        <form
          onSubmit={handleSubmit2(saveEntity)}
        >
          <VStack spacing={4}>
            <FormControl isRequired isInvalid={errors.kind !== undefined}>
              <FormLabel htmlFor="kind" fontWeight={'bold'}>
                {'Type'}
              </FormLabel>
              <Input
                id="kind"
                type="text"
                placeholder="Type"
                {...register('kind')}
              />

              <FormErrorMessage>
                {errors.kind && errors.kind.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={errors.number !== undefined}>
              <FormLabel htmlFor="number" fontWeight={'bold'}>
                {'Numéro'}
              </FormLabel>
              <Tooltip label="Numéro du lit, peut comporter des lettres">
                <Input
                  id="number"
                  type="text"
                  placeholder="Numéro"
                  {...register('number')}
                />
              </Tooltip>

              <FormErrorMessage>
                {errors.number && errors.number.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={errors.numberOfPlaces !== undefined}>
              <FormLabel htmlFor="number" fontWeight={'bold'}>
                {'Nombre de places'}
              </FormLabel>

              <Input
                id="number"
                type="number"
                placeholder="Nombre de places"
                {...register('numberOfPlaces', {
                  valueAsNumber: true
                })}
              />

              <FormErrorMessage>
                {errors.numberOfPlaces && errors.numberOfPlaces.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="room" fontWeight={'bold'}>
                {'Chambre'}
              </FormLabel>

              <Select
                id="roomId"
                {...register('roomId', {
                  valueAsNumber: true
                })}
              >
                <option value={undefined}>Pas de chambre</option>
                {rooms ?
                  rooms.map(room => (
                    <option value={room.id.toString()} key={room.id}>
                      {room.name}
                    </option>
                  )) :
                  null}
              </Select>
              <FormErrorMessage>
                {errors.roomId && errors.roomId.message}
              </FormErrorMessage>
            </FormControl>
            <HStack>
              <Button
                as={Link}
                to="/bed"
                leftIcon={<FaArrowLeft />}
                variant={'back'}
              >
                Retour
              </Button>
              &nbsp;
              <Button
                type="submit"
                isLoading={updating}
                leftIcon={<FaSave />}
                variant={'save'}
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
