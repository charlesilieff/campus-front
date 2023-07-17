import { Button, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { Option as O } from 'effect'
import { pipe } from 'effect'
import React, { useEffect } from 'react'
import { FaArrowLeft, FaPencilAlt } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'

import { getEntity } from './room.reducer'

export const RoomDetail = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<'id'>()

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id))
    }
  }, [])

  const roomEntity = useAppSelector(state => state.room.entity)
  return (
    <>
      {O.isSome(roomEntity) ?
        (
          <VStack alignItems={'flex-start'}>
            <Heading>Chambre</Heading>

            <Heading size={'md'}>Nom / Numéro</Heading>

            <Text>{roomEntity.value.name}</Text>

            <Heading size={'md'}>Commentaire</Heading>

            <Text>{O.getOrNull(roomEntity.value.comment)}</Text>
            <Heading size={'md'}>Type de chambre</Heading>
            <Text>{pipe(roomEntity.value.bedroomKind, O.map(b => b.name), O.getOrNull)}</Text>

            <HStack>
              <Button as={Link} to="/room" leftIcon={<FaArrowLeft />} variant="back">
                Retour
              </Button>

              <Button
                as={Link}
                to={`/room/${roomEntity.value.id}/edit`}
                leftIcon={<FaPencilAlt />}
                variant="modify"
              >
                Modifier
              </Button>
            </HStack>
          </VStack>
        ) :
        null}
    </>
  )
}
