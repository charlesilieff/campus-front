import { Button, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import * as O from '@effect/data/Option'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { FaArrowLeft, FaPencilAlt } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'

import { getEntity } from './bed.reducer'

export const BedDetail = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<'id'>()
  useEffect(() => {
    if (id) {
      dispatch(getEntity(id))
    }
  }, [])

  const bedEntity = useAppSelector(state => state.bed.entity)

  return (
    <>
      {O.isSome(bedEntity) ?
        (
          <VStack alignItems={'flex-start'}>
            <Heading>Lit</Heading>

            <Heading size={'md'}>
              <Text>Type</Text>
            </Heading>
            <Text>{bedEntity.value.kind}</Text>
            <Heading size={'md'}>
              <Text>Numéro / Nom</Text>
            </Heading>
            <Text>{bedEntity.value.number}</Text>
            <Heading size={'md'}>
              <Text>Nombre de places</Text>
            </Heading>
            <Text>{bedEntity.value.numberOfPlaces}</Text>
            <Heading size={'md'}>Chambre</Heading>
            <Text>{O.isSome(bedEntity.value.room) ? bedEntity.value.room.value.name : ''}</Text>
            <HStack>
              <Button as={Link} to="/bed" variant={'back'} leftIcon={<FaArrowLeft />}>
                Retour
              </Button>
              <Button
                as={Link}
                to={`/bed/${bedEntity.value.id}/edit`}
                variant={'modify'}
                leftIcon={<FaPencilAlt />}
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
