import { Button, Heading, HStack, Table, Tbody, Td, Th, Thead, Tr, VStack } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { PlaceMenu } from 'app/shared/layout/menus/placeMenu'
import React, { useEffect } from 'react'
import { FaEye, FaPencilAlt, FaPlus, FaSync } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import { getEntities } from './room.reducer'
import { RoomDeleteDialog } from './roomdelete-dialog'

export const Room = () => {
  const dispatch = useAppDispatch()

  const roomList = useAppSelector(state => state.room.entities)
  const loading = useAppSelector(state => state.room.loading)

  useEffect(() => {
    dispatch(getEntities())
  }, [])

  const handleSyncList = () => {
    dispatch(getEntities())
  }

  return (
    <VStack>
      <Heading>Chambres / Lieux de couchage</Heading>
      <HStack justifyContent={'space-between'} w={'100%'}>
        <PlaceMenu />
        <HStack>
          <Button
            variant={'see'}
            onClick={handleSyncList}
            isLoading={loading}
            leftIcon={<FaSync />}
          >
            Rafraîchir
          </Button>
          <Button
            as={Link}
            color={'white'}
            backgroundColor={'#e95420'}
            _hover={{ textDecoration: 'none', color: 'orange' }}
            to={`new`}
            leftIcon={<FaPlus />}
          >
            Créer une chambre
          </Button>
        </HStack>
      </HStack>

      {roomList && roomList.length > 0 ?
        (
          <Table>
            <Thead>
              <Tr>
                <Th>Nom / Numéro</Th>
                <Th>Commentaire</Th>
                <Th>Type de chambre</Th>
                <Th>Emplacement de la chambre</Th>
                <Th>Nombre de lits</Th>
              </Tr>
            </Thead>
            <Tbody>
              {roomList.map((room, i) => (
                <Tr key={`entity-${i}`} data-cy="entityTable">
                  <Td>
                    {' '}
                    <Button as={Link} to={`${room.id}`} variant="see" size="sm">
                      {room.name}
                    </Button>
                  </Td>
                  <Td>{room.comment}</Td>
                  <Td>
                    {room.bedroomKind ?
                      (
                        <Link to={`/bedroom-kind/${room.bedroomKind.id}`}>
                          {room.bedroomKind.name}
                        </Link>
                      ) :
                      ''}
                  </Td>
                  <Td>
                    {room.place ?
                      <Link to={`/place/${room.place.id}`}>{room.place.name}</Link> :
                      ''}
                  </Td>
                  <Td>{room.beds?.length}</Td>
                  <Td className="text-right">
                    <HStack justifyContent={'flex-end'} spacing={0}>
                      <Button
                        as={Link}
                        to={`${room.id}`}
                        variant={'see'}
                        leftIcon={<FaEye />}
                        size="sm"
                        borderRightRadius={0}
                      >
                        Voir
                      </Button>
                      <Button
                        as={Link}
                        to={`${room.id}/edit`}
                        variant={'modify'}
                        leftIcon={<FaPencilAlt />}
                        size="sm"
                        borderRadius={0}
                      >
                        Éditer
                      </Button>
                      <RoomDeleteDialog
                        // @ts-expect-error TODO: fix this
                        roomId={room.id}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) :
        (!loading && <div className="alert alert-warning">Pas de chambres crées.</div>)}
    </VStack>
  )
}
