import { Button, Heading, HStack, Table, Tbody, Td, Th, Thead, Tr, VStack } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { FaEye, FaPencilAlt, FaPlus, FaSync } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import { getEntities } from './pricing.reducer'
import { PricingDeleteDialog } from './pricingdelete-dialog'

export const Pricing = () => {
  const dispatch = useAppDispatch()

  const pricingList = useAppSelector(state => state.pricing.entities)
  const loading = useAppSelector(state => state.pricing.loading)

  useEffect(() => {
    dispatch(getEntities())
  }, [])

  const handleSyncList = () => {
    dispatch(getEntities())
  }

  return (
    <VStack>
      <Heading alignSelf={'flex-start'}>Tarifs</Heading>
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
          Créez un nouveau tarif
        </Button>
      </HStack>

      {pricingList && pricingList.length > 0 ?
        (
          <Table>
            <Thead>
              <Tr>
                <Th>Nom</Th>
                <Th>Prix</Th>
                <Th>Commentaire</Th>
              </Tr>
            </Thead>
            <Tbody>
              {pricingList.map((pricing, i) => (
                <Tr key={`entity-${i}`} data-cy="entityTable">
                  <Td>
                    <Button as={Link} to={`${pricing.id}`} variant="see" size="sm">
                      {pricing.wording}
                    </Button>
                  </Td>
                  <Td>{pricing.price}</Td>
                  <Td>{pricing.comment}</Td>
                  <Td>
                    <HStack justifyContent={'flex-end'} spacing={0}>
                      <Button
                        as={Link}
                        to={`${pricing.id}`}
                        variant={'see'}
                        leftIcon={<FaEye />}
                        size="sm"
                        borderRightRadius="0"
                      >
                        Voir
                      </Button>
                      <Button
                        as={Link}
                        to={`${pricing.id}/edit`}
                        variant={'modify'}
                        leftIcon={<FaPencilAlt />}
                        size="sm"
                        borderRadius={0}
                      >
                        Modifier
                      </Button>
                      <PricingDeleteDialog pricingId={pricing.id} />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) :
        (!loading && <div className="alert alert-warning">No Pricing found</div>)}
    </VStack>
  )
}
