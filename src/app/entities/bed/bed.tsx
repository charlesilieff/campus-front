import { Button, Heading, HStack, Table, Tbody, Td, Text, Th, Thead, Tr,
  VStack } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { PlaceMenu } from 'app/shared/layout/menus/placeMenu'
import React, { useEffect } from 'react'
import { FaEye, FaPencilAlt, FaPlus, FaSync } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import { getEntities } from './bed.reducer'
import { BedDeleteDialog } from './beddelete-dialog'

export const Bed = () => {
  const dispatch = useAppDispatch()

  const bedList = useAppSelector(state => state.bed.entities)
  const loading = useAppSelector(state => state.bed.loading)

  useEffect(() => {
    dispatch(getEntities())
  }, [])

  const handleSyncList = () => {
    dispatch(getEntities())
  }

  return (
    <VStack>
      <Heading>Liste des lits</Heading>
      <HStack justifyContent={'space-between'} w={'100%'}>
        <PlaceMenu />
        <HStack>
          <Button
            variant={'see'}
            onClick={handleSyncList}
            isLoading={loading}
            leftIcon={<FaSync />}
          >
            Rafraîchir la liste
          </Button>
          <Link
            to={`new`}
            className="btn btn-primary jh-create-entity"
            id="jh-create-entity"
            data-cy="entityCreateButton"
          >
            <HStack>
              <FaPlus />
              <Text>Créez un nouveau lit</Text>
            </HStack>
          </Link>
        </HStack>
      </HStack>

      <div className="table-responsive">
        {bedList && bedList.length > 0 ?
          (
            <Table variant={'striped'}>
              <Thead>
                <Tr>
                  <Th>Type</Th>
                  <Th>Numéro</Th>
                  <Th>Nombre de places</Th>
                  <Th>Chambre</Th>
                </Tr>
              </Thead>
              <Tbody>
                {bedList.map((bed, i) => (
                  <Tr key={`entity-${i}`}>
                    <Td>{bed.kind}</Td>
                    <Td>
                      <Button as={Link} to={`${bed.id}`} size="sm" variant={'see'}>
                        {bed.number}
                      </Button>
                    </Td>

                    <Td>{bed.numberOfPlaces}</Td>
                    <Td>
                      {bed.room ? <Link to={`/room/${bed.room.id}`}>{bed.room.name}</Link> : ''}
                    </Td>
                    <Td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button
                          as={Link}
                          to={`${bed.id}`}
                          variant="see"
                          size="sm"
                          leftIcon={<FaEye />}
                          borderRightRadius={0}
                        >
                          Voir
                        </Button>
                        <Button
                          as={Link}
                          to={`${bed.id}/edit`}
                          size="sm"
                          variant="modify"
                          borderRadius={0}
                          leftIcon={<FaPencilAlt />}
                        >
                          Modifier
                        </Button>
                        <BedDeleteDialog bedId={bed.id} />
                      </div>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) :
          (!loading && <div className="alert alert-warning">Pas de lits trouvés</div>)}
      </div>
    </VStack>
  )
}
