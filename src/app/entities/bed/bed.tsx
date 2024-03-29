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
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { PlaceMenu } from 'app/shared/layout/menus/placeMenu'
import { ordBedByNumber } from 'app/shared/model/bed.model'
import { Option as O } from 'effect'
import { ReadonlyArray as A } from 'effect'
import { pipe } from 'effect'
import React, { useEffect } from 'react'
import { FaEye, FaPencilAlt, FaPlus, FaSync } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import { getEntities } from './bed.reducer'
import { BedDeleteDialog } from './beddelete-dialog'

export const Bed = () => {
  const dispatch = useAppDispatch()

  const bedListSortByName = pipe(
    useAppSelector(state => state.bed.entities),
    A.sort(ordBedByNumber)
  )

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
          <Button
            as={Link}
            color={'white'}
            backgroundColor={'#e95420'}
            _hover={{ textDecoration: 'none', color: 'orange' }}
            to={`new`}
            leftIcon={<FaPlus />}
          >
            Créez un nouveau lit
          </Button>
        </HStack>
      </HStack>

      {bedListSortByName && bedListSortByName.length > 0 ?
        (
          <Table>
            <Thead>
              <Tr>
                <Th>Type</Th>
                <Th>Numéro</Th>
                <Th>Nombre de places</Th>
                <Th>Chambre</Th>
              </Tr>
            </Thead>
            <Tbody>
              {bedListSortByName.map((bed, i) => (
                <Tr key={`entity-${i}`}>
                  <Td>{bed.kind}</Td>
                  <Td>
                    <Button as={Link} to={`${bed.id}`} size="sm" variant={'see'}>
                      {bed.number}
                    </Button>
                  </Td>

                  <Td>{bed.numberOfPlaces}</Td>
                  <Td>
                    {bed.room && O.isSome(bed.room) ?
                      <Link to={`/room/${bed.room.value.id}`}>{bed.room.value.name}</Link> :
                      ''}
                  </Td>
                  <Td className="text-right">
                    <HStack justifyContent={'flex-end'} spacing={0}>
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
                      <BedDeleteDialog
                        bedId={bed.id}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) :
        (!loading && <div className="alert alert-warning">Pas de lits trouvés</div>)}
    </VStack>
  )
}
