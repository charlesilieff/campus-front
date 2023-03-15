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
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getEntities as getRooms } from 'app/entities/room/room.reducer'
import type { IBed } from 'app/shared/model/bed.model'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FaArrowLeft, FaSave } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { createEntity, getEntity, reset, updateEntity } from './bed.reducer'

interface BedForm {
  number: string
  numberOfPlaces: number
  kind: string
  roomId: string
}

export const BedUpdate = () => {
  const bedEntity = useAppSelector(state => state.bed.entity)
  const { id } = useParams<'id'>()
  const isNew = id === undefined
  const defaultValues = () =>
    isNew ? {} : {
      ...bedEntity,
      // @ts-expect-error TODO: fix this
      roomId: bedEntity?.room?.id === '' ? undefined : bedEntity?.room?.id
    }

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset: resetForm
  } = useForm<BedForm>()
  useEffect(() => {
    resetForm(defaultValues())
  }, [bedEntity.id])

  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  const rooms = useAppSelector(state => state.room.entities)

  const loading = useAppSelector(state => state.bed.loading)
  const updating = useAppSelector(state => state.bed.updating)
  const updateSuccess = useAppSelector(state => state.bed.updateSuccess)

  const handleClose = () => {
    navigate('/bed')
  }

  useEffect(() => {
    if (isNew) {
      dispatch(reset())
    } else {
      dispatch(getEntity(id))
    }

    dispatch(getRooms())
  }, [])

  useEffect(() => {
    if (updateSuccess) {
      handleClose()
    }
  }, [updateSuccess])

  interface ExtendIBedForTheBAckendToBeDeleted extends IBed {
    roomId: string
  }

  const saveEntity = (values: ExtendIBedForTheBAckendToBeDeleted) => {
    const entity: ExtendIBedForTheBAckendToBeDeleted = {
      ...bedEntity,
      ...values,
      // this is very important but  very bad, otherwise the backend will not be able to find the room
      roomId: values.roomId === '' ? undefined : values.roomId,
      room: rooms.find(it => it.id.toString() === values.roomId.toString())
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
        {isNew ? 'Créez' : 'Modifiez'} un lit
      </Heading>

      {loading ? <p>Chargement...</p> : (
        <form
          onSubmit={handleSubmit(saveEntity)}
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
                {...register('kind', {
                  required: 'Le type est obligatoire',
                  minLength: {
                    value: 4,
                    message: 'This field is required to be at least 4 characters.'
                  },
                  maxLength: {
                    value: 20,
                    message: 'This field cannot be longer than 20 characters.'
                  }
                })}
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
                  {...register('number', {
                    required: 'Le numéro est obligatoire',

                    maxLength: {
                      value: 20,
                      message: 'This field cannot be longer than 20 characters.'
                    }
                  })}
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
                  required: 'Le nombre de places est obligatoire'
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
                id="room"
                {...register('roomId', {})}
              >
                <option value="" key="0" />
                {rooms ?
                  rooms.map(room => (
                    <option value={room.id} key={room.id}>
                      {room.name}
                    </option>
                  )) :
                  null}
              </Select>
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
