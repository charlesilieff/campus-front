import { Box, Button, Container, Heading, HStack, SimpleGrid, StackDivider, Table, TableContainer,
  Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { initialState } from 'app/shared/reducers/authentication'
import React, { useEffect } from 'react'
import { FaEye, FaPencilAlt, FaPlus, FaSort, FaSync } from 'react-icons/fa'
import { Link } from 'react-router-dom'

// import { ColumnSorter } from '../../components/table/ColumnSorter'
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
    <VStack
      // divider={<StackDivider borderColor="gray.200" />}
      divider={<StackDivider borderColor="white" />}
      spacing={4}
      align="stretch"
      maxWidth={'100%'}
      // display={'inline-flex'}
      // minWidth={300}
      // alignItems={'block'}
      // // minHeight={300}
    >
      {
        /* <Box bg="red.200" width={[1, 1 / 2, 1 / 4]}>
        This is a box
      </Box> */
      }

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
      <Box>
        {mySort2 && pricingList.length > 0 ?
          (
            // colorScheme="#FFE2C7"

            <Table
              id="tableTarif"
              variant="striped"
              colorScheme="orange"
              // overflow={'scroll'}
              display={'block'}
              // bgSize={'sm' || 'md' || 'lg'}
            >
              <Thead bgColor="gray.200">
                <Tr>
                  <Th
                    // justifyContent={'flex-end'}
                    fontSize={{ base: '8px', sm: '10px', md: '12px' }}
                  >
                    Categorie utilisateur <br />
                    <Button
                      as={Link}
                      color={'white'}
                      backgroundColor={'#e95420'}
                      _hover={{ textDecoration: 'none', color: 'orange' }}
                      to={`new`}
                      size={'xs'}
                      leftIcon={<FaPlus />}
                    >
                      {/* Créez une nouvelle catégorie utilisateur */}
                    </Button>
                    <Button
                      as={Link}
                      color={'white'}
                      backgroundColor={'#e95420'}
                      _hover={{ textDecoration: 'none', color: 'orange' }}
                      size={'xs'}
                      leftIcon={<FaSort />}
                      to={`new`}
                    >
                    </Button>
                  </Th>
                  <Th fontSize={{ base: '8px', sm: '10px', md: '12px' }}>
                    Type de réservation
                  </Th>
                  <Th fontSize={{ base: '8px', sm: '10px', md: '12px' }}>Prix</Th>
                  <Th fontSize={{ base: '8px', sm: '10px', md: '12px' }}>
                    Commentaire
                  </Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody
                fontSize={{ base: '8px', sm: '10px', md: '12px' }}
              >
                {/* {myData.map((pricing, i) => ( */}
                {myData.map((pricing, i) => (
                  <Tr key={`entity-${i}`}>
                    <Td>
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
                    <Td>
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

                    <Td>{pricing.price}</Td>
                    <Td>
                      {pricing.comment}
                    </Td>
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
                            minWidth={'110px'}
                            borderRightRadius="0"
                            fontSize={{ base: '8px', sm: '10px', md: '12px' }}
                          >
                            Voir
                          </Button>
                          <Button
                            as={Link}
                            to={`${pricing.id}/edit`}
                            variant={'modify'}
                            leftIcon={<FaPencilAlt />}
                            size="sm"
                            minWidth={'110px'}
                            borderRadius={0}
                            fontSize={{ base: '8px', sm: '10px', md: '12px' }}
                          >
                            Modifier
                          </Button>
                          <Box
                            minWidth={'110px'}
                            fontSize={{ base: '8px', sm: '10px', md: '12px' }}
                          >
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
