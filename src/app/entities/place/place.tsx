import { Button, Heading, HStack, Table, Tbody, Td, Th, Thead, Tr, VStack } from '@chakra-ui/react'
import * as O from '@effect/data/Option'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { FaEye, FaPencilAlt, FaPlus, FaSync } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import { findAllPlaces } from './place.reducer'
import { PlaceDeleteDialog } from './placedelete-dialog'
import { byteSize, openFile } from './utils'

export const Place = () => {
  const dispatch = useAppDispatch()

  const placeList = useAppSelector(state => state.place.entities)
  const loading = useAppSelector(state => state.place.loading)

  useEffect(() => {
    dispatch(findAllPlaces())
  }, [])

  const handleSyncList = () => {
    dispatch(findAllPlaces())
  }

  return (
    <VStack alignItems={'flex-start'}>
      <Heading>Lieux</Heading>
      <HStack alignSelf={'flex-end'}>
        <Button
          variant={'see'}
          onClick={handleSyncList}
          isLoading={loading}
          leftIcon={<FaSync />}
        >
          Rafraîchir la liste
        </Button>
        <Button
          as={Link}
          color={'white'}
          backgroundColor={'#e95420'}
          _hover={{ textDecoration: 'none', color: 'orange' }}
          to={`new`}
          leftIcon={<FaPlus />}
        >
          Créez un nouveau lieu
        </Button>
      </HStack>

      {placeList && placeList.length > 0 ?
        (
          <Table variant={'striped'}>
            <Thead>
              <Tr>
                <Th>Nom</Th>
                <Th>Commentaire</Th>
                <Th>Image</Th>
              </Tr>
            </Thead>
            <Tbody>
              {placeList.map((place, i) => (
                <Tr key={`entity-${i}`} data-cy="entityTable">
                  <Td>
                    <Button as={Link} to={`${O.getOrUndefined(place.id)}`} color="link" size="sm">
                      {place.name}
                    </Button>
                  </Td>
                  <Td>{O.getOrUndefined(place.comment)}</Td>
                  <Td>
                    {O.isSome(place.image) && O.isSome(place.imageContentType) ?
                      (
                        <div>
                          <a onClick={openFile(place.imageContentType.value, place.image.value)}>
                            <img
                              src={`data:${place.imageContentType.value};base64,${place.image.value}`}
                              style={{ maxHeight: '30px' }}
                            />
                            &nbsp;
                          </a>

                          <span>
                            {place.imageContentType.value}, {byteSize(place.image.value)}
                          </span>
                        </div>
                      ) :
                      null}
                  </Td>
                  <Td className="text-right">
                    <HStack justifyContent={'flex-end'} spacing={0}>
                      {O.isSome(place.id) ?
                        (
                          <>
                            <Button
                              as={Link}
                              to={`${place.id.value}`}
                              variant="see"
                              size="sm"
                              leftIcon={<FaEye />}
                              borderRightRadius={0}
                            >
                              Voir
                            </Button>
                            <Button
                              as={Link}
                              to={`${place.id.value}/edit`}
                              size="sm"
                              variant={'modify'}
                              borderRadius={0}
                              leftIcon={<FaPencilAlt />}
                            >
                              Modifier
                            </Button>

                            <PlaceDeleteDialog
                              placeId={place.id.value}
                            />
                          </>
                        ) :
                        null}
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) :
        (!loading && <div className="alert alert-warning">Aucun lieu trouvé</div>)}
    </VStack>
  )
}
