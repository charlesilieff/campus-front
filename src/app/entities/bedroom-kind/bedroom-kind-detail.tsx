import { Button, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { FaArrowLeft, FaPencilAlt } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'

import { getEntity } from './bedroom-kind.reducer'

export const BedroomKindDetail = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<'id'>()

  useEffect(() => {
    // @ts-expect-error TODO: fix this
    dispatch(getEntity(id))
  }, [])

  const bedroomKindEntity = useAppSelector(state => state.bedroomKind.entity)
  return (
    <VStack alignItems={'flex-start'}>
      <Heading>Type de chambre</Heading>

      <Heading size={'md'}>Nom</Heading>

      <Text>{bedroomKindEntity.name}</Text>

      <Heading size={'md'}>Description</Heading>

      <Text>{bedroomKindEntity.description}</Text>
      <HStack>
        <Button
          as={Link}
          variant={'back'}
          to="/bedroom-kind"
          leftIcon={<FaArrowLeft />}
        >
          Retour
        </Button>
        &nbsp;
        <Button
          variant={'modify'}
          as={Link}
          to={`/bedroom-kind/${bedroomKindEntity.id}/edit`}
          leftIcon={<FaPencilAlt />}
        >
          Modifier
        </Button>
      </HStack>
    </VStack>
  )
}
