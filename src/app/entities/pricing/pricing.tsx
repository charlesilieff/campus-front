import { Box, Button, Heading, HStack, Label, SimpleGrid, StackDivider, Table, Tbody, Td, Th, Thead,
  Tr, VStack } from '@chakra-ui/react'
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

  // const mySort = pipe(pricingList, A.sort((a, b) =>
  const mySort = myData.sort((a, b) =>
    a.userCategory.name !== b.userCategory.name ?
      a.userCategory.name.localeCompare(b.userCategory.name) :
      a.typeReservation.name !== b.typeReservation.name ?
      a.typeReservation.name.localeCompare(b.typeReservation.name) :
      a.price - b.price
  )

  return (
    <VStack
      divider={<StackDivider borderColor="white" />}
      spacing={4}
      align="stretch"
      maxWidth={'100%'}
    >
      <Heading alignSelf={'flex-start'}>Tarifs</Heading>
      <HStack alignSelf={'flex-end'} display={'block'}>
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
      <Box width={'100%'}>
        {mySort && pricingList.length > 0 ?
          (
            <Table
              id="tableTarif"
              variant="striped"
              // backgroundColor={'orange.100'}
            >
              <Thead bgColor="white" width={'auto'}>
                <Tr>
                  <Th
                    margin={{ base: '2px', sm: '10px', md: '20px' }}
                    padding={{ base: '2px', sm: '10px', md: '20px' }}
                    fontSize={{ base: '8px', sm: '10px', md: '14px' }}
                  >
                    Categorie utilisateur&nbsp;
                    <Button
                      as={Link}
                      color={'white'}
                      backgroundColor={'#e95420'}
                      _hover={{ textDecoration: 'none', color: 'orange' }}
                      to={`/user-category/new`}
                      size={'xs'}
                      leftIcon={<FaPlus />}
                    >
                      {/* Créez une nouvelle catégorie utilisateur */}
                    </Button>
                  </Th>
                  <Th
                    margin={{ base: '2px', sm: '10px', md: '20px' }}
                    padding={{ base: '2px', sm: '10px', md: '20px' }}
                    fontSize={{ base: '8px', sm: '10px', md: '14px' }}
                  >
                    Type de réservation
                  </Th>
                  <Th
                    margin={{ base: '2px', sm: '10px', md: '20px' }}
                    padding={{ base: '2px', sm: '10px', md: '20px' }}
                    fontSize={{ base: '8px', sm: '10px', md: '14px' }}
                  >
                    Prix
                  </Th>
                  <Th
                    margin={{ base: '2px', sm: '10px', md: '20px' }}
                    padding={{ base: '2px', sm: '10px', md: '20px' }}
                    fontSize={{ base: '8px', sm: '10px', md: '14px' }}
                  >
                    Commentaire
                  </Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody
                fontSize={{ base: '8px', sm: '10px', md: '16px' }}
                // width={'auto'}
              >
                {myData.map((pricing, i) => (
                  <Tr key={`entity-${i}`}>
                    <Td
                      margin={{ base: '2px', sm: '10px', md: '20px' }}
                      padding={{ base: '2px', sm: '10px', md: '20px' }}
                      // padding={screen.availWidth > 500 ? 'auto' : '5px'}
                    >
                      {pricing.userCategory ?
                        (
                          <Link
                            title="Modfier la catégorie utilisateur"
                            to={`/user-category/${pricing.userCategory.id}/edit`}
                          >
                            {pricing.userCategory.name}
                          </Link>
                        ) :
                        'yyy'}
                    </Td>
                    <Td
                      margin={{ base: '2px', sm: '10px', md: '20px' }}
                      padding={{ base: '2px', sm: '10px', md: '20px' }}
                    >
                      {pricing.typeReservation ?
                        (
                          <Link
                            title="Modfier le type de réservation"
                            to={`/type-reservation/${pricing.typeReservation.id}`}
                          >
                            {pricing.typeReservation.name}
                          </Link>
                        ) :
                        'xxx'}
                    </Td>

                    <Td
                      margin={{ base: '2px', sm: '10px', md: '20px' }}
                      padding={{ base: '2px', sm: '10px', md: '20px' }}
                    >
                      {pricing.price}
                    </Td>
                    <Td
                      margin={{ base: '2px', sm: '10px', md: '20px' }}
                      padding={{ base: '2px', sm: '10px', md: '20px' }}
                    >
                      {pricing.comment}
                    </Td>

                    <Td>
                      <HStack spacing={0}>
                        <SimpleGrid
                          columns={{ md: 1, lg: 3 }}
                        >
                          <Button
                            as={Link}
                            to={`${pricing.id}`}
                            variant={'see'}
                            leftIcon={<FaEye />}
                            size="sm"
                            minWidth={{ base: '55px', sm: '110px', md: '110px' }}
                            borderRightRadius="0"
                            fontSize={{ base: '8px', sm: '10px', md: '14px' }}
                          >
                            Voir
                          </Button>
                          <Button
                            as={Link}
                            to={`${pricing.id}/edit`}
                            variant={'modify'}
                            leftIcon={<FaPencilAlt />}
                            size="sm"
                            minWidth={{ base: '55px', sm: '110px', md: '110px' }}
                            borderRadius={0}
                            fontSize={{ base: '8px', sm: '10px', md: '14px' }}
                          >
                            Modifier
                          </Button>
                          <Box>
                            <PricingDeleteDialog pricingId={pricing.id} />
                          </Box>
                        </SimpleGrid>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) :
          (!loading && <div className="alert alert-warning">No Pricing found</div>)}
      </Box>
    </VStack>
  )
}
