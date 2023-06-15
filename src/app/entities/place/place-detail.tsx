import { Box, Button, Heading, HStack, Image, Text, VStack } from '@chakra-ui/react'
import * as O from '@effect/data/Option'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { FaArrowLeft, FaPencilAlt } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'

import { findOnePlaceById } from './place.reducer'
import { byteSize, openFile } from './utils'

export const PlaceDetail = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    if (id) {
      dispatch(findOnePlaceById(id))
    }
  }, [])

  const placeEntity = useAppSelector(state => state.place.entity)
  return (
    <>
      {O.isSome(placeEntity) ?
        (
          <VStack alignItems={'flex-start'}>
            <Heading>Lieu</Heading>

            <Heading size={'md'}>Nom</Heading>

            <Text>{placeEntity.value.name}</Text>

            <Heading size={'md'}>Commentaire</Heading>

            <Text>{O.getOrUndefined(placeEntity.value.comment)}</Text>

            <Heading size={'md'}>Image</Heading>

            <Text>
              {O.isSome(placeEntity.value.image) && O.isSome(placeEntity.value.imageContentType) ?
                (
                  <Box>
                    <Box
                      onClick={openFile(
                        placeEntity.value.imageContentType.value,
                        placeEntity.value.image.value
                      )}
                    >
                      <Image
                        src={`data:${placeEntity.value.imageContentType.value};base64,${placeEntity.value.image.value}`}
                        style={{ maxHeight: '30px' }}
                      />
                    </Box>

                    <span>
                      {placeEntity.value.imageContentType.value},{' '}
                      {byteSize(placeEntity.value.image.value)}
                    </span>
                  </Box>
                ) :
                null}
            </Text>
            <HStack>
              <Button as={Link} to="/place" variant={'back'} leftIcon={<FaArrowLeft />}>
                Retour
              </Button>

              <Button
                as={Link}
                to={`/place/${O.getOrUndefined(placeEntity.value.id)}/edit`}
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
