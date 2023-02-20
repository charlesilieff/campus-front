import { Button, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { FaArrowLeft, FaPencilAlt } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'

import { getEntity } from './bed.reducer'

export const BedDetail = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<'id'>()
  useEffect(() => {
    dispatch(getEntity(id))
  }, [])

  const bedEntity = useAppSelector(state => state.bed.entity)
  return (
    <VStack alignItems={'flex-start'}>
      <Heading>Lit</Heading>

      <Heading size={'md'}>
        <Text>Type</Text>
      </Heading>
      <Text>{bedEntity.kind}</Text>
      <Heading size={'md'}>
        <Text>Numéro / Nom</Text>
      </Heading>
      <Text>{bedEntity.number}</Text>
      <Heading size={'md'}>
        <Text>Nombre de places</Text>
      </Heading>
      <Text>{bedEntity.numberOfPlaces}</Text>
      <Heading size={'md'}>Chambre</Heading>
      <Text>{bedEntity.room ? bedEntity.room.name : ''}</Text>
      <HStack>
        <Button as={Link} to="/bed" variant={'back'} leftIcon={<FaArrowLeft />}>
          Retour
        </Button>
        <Button
          as={Link}
          to={`/bed/${bedEntity.id}/edit`}
          variant={'modify'}
          leftIcon={<FaPencilAlt />}
        >
          Modifier
        </Button>
      </HStack>
    </VStack>
  )
}
