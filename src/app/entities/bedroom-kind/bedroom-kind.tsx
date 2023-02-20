import {
  Button,
  Heading,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack
} from '@chakra-ui/react'
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
          <Link
            className="btn btn-primary jh-create-entity"
            id="jh-create-entity"
            data-cy="entityCreateButton"
            to={`new`}
          >
            <HStack>
              <FaPlus />
              <Text>Créez un nouveau type de chambre</Text>
            </HStack>
          </Link>
        </HStack>
      </HStack>

      {bedroomKindList && bedroomKindList.length > 0 ?
        (
          <Table variant={'striped'}>
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

                  <Td>{bedroomKind.description}</Td>
                  <Td className="text-right">
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
                    <BedroomKindDeleteDialog bedroomKindId={bedroomKind.id} />
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
