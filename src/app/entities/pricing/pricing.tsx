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

  const myData = pricingList.flatMap(pricing => ({
    ...pricing
  }))

  const mySort2 = myData.sort((a, b) =>
    a.userCategory.name !== b.userCategory.name ?
      a.userCategory.name.localeCompare(b.userCategory.name) :
      a.typeReservation.name !== b.typeReservation.name ?
      a.typeReservation.name.localeCompare(b.typeReservation.name) :
      a.price - b.price
  )
  console.log('mon tri ', mySort2)

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
      {/* {console.log('toto' && pricingList)} */}
      {mySort2 && pricingList.length > 0 ?
        (
          <Table>
            <Thead>
              <Tr>
                <Th>Categorie utilisateur</Th>
                <Th>Type de réservation</Th>
                <Th>Prix</Th>
                <Th>Commentaire</Th>
              </Tr>
            </Thead>
            <Tbody>
              {/* {myData.map((pricing, i) => ( */}
              {myData.map((pricing, i) => (
                <Tr key={`entity-${i}`}>
                  <Td>
                    {pricing.userCategory ?
                      (
                        <Link to={`/user-category/${pricing.userCategory.id}`}>
                          {pricing.userCategory.name}
                        </Link>
                      ) :
                      'yyy'}
                  </Td>
                  <Td>
                    {pricing.typeReservation ?
                      (
                        <Link to={`/type-reservation/${pricing.typeReservation.id}`}>
                          {pricing.typeReservation.name}
                        </Link>
                      ) :
                      'xxx'}
                  </Td>

                  <Td>{pricing.price}</Td>
                  <Td>{pricing.comment}</Td>
                  {
                    /* <Td>
                    {pricing.typeReservation ?
                      pricing.typeReservation.map((val, j) => (
                        <span key={j}>
                          <Link to={`bed/${val.id}`}>{val.number}</Link>
                          {j === pricing.typeReservation.length - 1 ? '' : ', '}
                        </span>
                      )) :
                      null}
                  </Td> */
                  }
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
