import { Button, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { PlaceMenu } from 'app/shared/layout/menus/placeMenu'
import React, { useEffect } from 'react'
import { FaEye, FaPencilAlt, FaPlus, FaSync } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { Table } from 'reactstrap'

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
      <HStack alignSelf={'flex-end'}>
        <Button variant={'see'} onClick={handleSyncList} disabled={loading} leftIcon={<FaSync />}>
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

      <PlaceMenu />

      <div className="table-responsive">
        {bedList && bedList.length > 0 ?
          (
            <Table responsive>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Numéro</th>
                  <th>Nombre de places</th>
                  <th>Chambre</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {bedList.map((bed, i) => (
                  <tr key={`entity-${i}`} data-cy="entityTable">
                    <td>{bed.kind}</td>
                    <td>
                      <Button as={Link} to={`${bed.id}`} color="link" size="sm">
                        {bed.number}
                      </Button>
                    </td>

                    <td>{bed.numberOfPlaces}</td>
                    <td>
                      {bed.room ? <Link to={`/room/${bed.room.id}`}>{bed.room.name}</Link> : ''}
                    </td>
                    <td className="text-right">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) :
          (!loading && <div className="alert alert-warning">Pas de lits trouvés</div>)}
      </div>
    </VStack>
  )
}
