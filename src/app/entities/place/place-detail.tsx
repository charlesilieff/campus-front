import { Button, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { FaArrowLeft, FaPencilAlt } from 'react-icons/fa'
import { byteSize, openFile } from 'react-jhipster'
import { Link, useParams } from 'react-router-dom'

import { getEntity } from './place.reducer'

export const PlaceDetail = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    dispatch(getEntity(id))
  }, [])

  const placeEntity = useAppSelector(state => state.place.entity)
  return (
    <VStack alignItems={'flex-start'}>
      <Heading>Lieu</Heading>

      <Heading size={'md'}>Nom</Heading>

      <Text>{placeEntity.name}</Text>

      <Heading size={'md'}>Commentaire</Heading>

      <Text>{placeEntity.comment}</Text>

      <Heading size={'md'}>Image</Heading>

      <Text>
        {placeEntity.image ?
          (
            <div>
              {placeEntity.imageContentType ?
                (
                  <a onClick={openFile(placeEntity.imageContentType, placeEntity.image)}>
                    <img
                      src={`data:${placeEntity.imageContentType};base64,${placeEntity.image}`}
                      style={{ maxHeight: '30px' }}
                    />
                  </a>
                ) :
                null}
              <span>
                {placeEntity.imageContentType}, {byteSize(placeEntity.image)}
              </span>
            </div>
          ) :
          null}
      </Text>
      <HStack>
        <Button as={Link} to="/place" variant={'back'} leftIcon={<FaArrowLeft />}>
          Retour
        </Button>

        <Button
          as={Link}
          to={`/place/${placeEntity.id}/edit`}
          variant={'modify'}
          leftIcon={<FaPencilAlt />}
        >
          Modifier
        </Button>
      </HStack>
    </VStack>
  )
}
