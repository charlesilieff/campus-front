import { Button, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { FaArrowLeft, FaPencilAlt } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'

import { getEntity } from './room.reducer'

export const RoomDetail = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<'id'>()

  useEffect(() => {
    // @ts-expect-error TODO: fix this
    dispatch(getEntity(id))
  }, [])

  const roomEntity = useAppSelector(state => state.room.entity)
  return (
    <VStack alignItems={'flex-start'}>
      <Heading>Chambre</Heading>

      <Heading size={'md'}>Nom / Numéro</Heading>

      <Text>{roomEntity.name}</Text>

      <Heading size={'md'}>Commentaire</Heading>

      <Text>{roomEntity.comment}</Text>
      <Heading size={'md'}>Type de chambre</Heading>
      <Text>{roomEntity.bedroomKind ? roomEntity.bedroomKind.name : ''}</Text>

      <HStack>
        <Button as={Link} to="/room" leftIcon={<FaArrowLeft />} variant="back">
          Retour
        </Button>

        <Button
          as={Link}
          to={`/room/${roomEntity.id}/edit`}
          leftIcon={<FaPencilAlt />}
          variant="modify"
        >
          Modifier
        </Button>
      </HStack>
    </VStack>
  )
}
