import {
  Button,
  Heading,
  HStack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack
} from '@chakra-ui/react'
import * as O from '@effect/data/Option'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { PlaceMenu } from 'app/shared/layout/menus/placeMenu'
import React, { useEffect } from 'react'
import { FaEye, FaPencilAlt, FaPlus, FaSync } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import { getEntities } from './bedroom-kind.reducer'
import { BedroomKindDeleteDialog } from './bedroomkind-delete-dialog'

export const BedroomKind = () => {
  const dispatch = useAppDispatch()

  const bedroomKindList = useAppSelector(state => state.bedroomKind.entities)
  const loading = useAppSelector(state => state.bedroomKind.loading)

  useEffect(() => {
    dispatch(getEntities())
  }, [])

  const handleSyncList = () => {
    dispatch(getEntities())
  }

  return (
    <VStack>
      <Heading alignSelf={'flex-start'}>Type de chambre</Heading>
      <HStack justifyContent={'space-between'} w={'100%'}>
        <PlaceMenu />
        <HStack>
          <Button
            onClick={handleSyncList}
            isLoading={loading}
            variant={'see'}
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
            Créez un nouveau type de chambre
          </Button>
        </HStack>
      </HStack>

      {bedroomKindList && bedroomKindList.length > 0 ?
        (
          <Table>
            <Thead>
              <Tr>
                <Th>Nom</Th>
                <Th>Description</Th>
              </Tr>
            </Thead>
            <Tbody>
              {bedroomKindList.map((bedroomKind, i) => (
                <Tr key={`entity-${i}`} data-cy="entityTable">
                  <Td>
                    <Button
                      as={Link}
                      to={`${bedroomKind.id}`}
                      variant="see"
                      size="sm"
                    >
                      {bedroomKind.name}
                    </Button>
                  </Td>

                  <Td>
                    {O.getOrNull(bedroomKind.description)}
                  </Td>
                  <Td>
                    (
                    <HStack justifyContent={'flex-end'} spacing={0}>
                      <Button
                        as={Link}
                        to={`${bedroomKind.id}`}
                        variant="see"
                        size="sm"
                        borderRightRadius={0}
                        leftIcon={<FaEye />}
                      >
                        Voir
                      </Button>
                      <Button
                        as={Link}
                        to={`${bedroomKind.id}/edit`}
                        variant={'modify'}
                        borderRadius={0}
                        size="sm"
                        leftIcon={<FaPencilAlt />}
                      >
                        Modifier
                      </Button>

                      <BedroomKindDeleteDialog
                        bedroomKindId={bedroomKind.id}
                      />
                    </HStack>
                    )
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) :
        (!loading && <div className="alert alert-warning">Aucun type de chambre trouvé.</div>)}
    </VStack>
  )
}
