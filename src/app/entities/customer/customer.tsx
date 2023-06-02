import { Button, Heading, HStack, Table, Tbody, Td, Th, Thead, Tr, VStack } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { FaEye, FaPencilAlt, FaPlus } from 'react-icons/fa'
import { HiRefresh } from 'react-icons/hi'
import { Link } from 'react-router-dom'

import { getEntities } from './customer.reducer'
import { CustomerDeleteDialog } from './customerdelete-dialog'

export const Customer = () => {
  const dispatch = useAppDispatch()

  const customerList = useAppSelector(state => state.customer.entities)
  const loading = useAppSelector(state => state.customer.loading)

  useEffect(() => {
    handleSyncList()
  }, [])

  const handleSyncList = () => {
    dispatch(getEntities())
  }

  return (
    <VStack>
      <Heading alignSelf={'flex-start'}>Clients</Heading>
      <HStack alignSelf={'flex-end'}>
        <Button
          onClick={handleSyncList}
          isLoading={loading}
          leftIcon={<HiRefresh size={'25px'} />}
          backgroundColor={'#17a2b8'}
          color={'white'}
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
          Créez un nouveau client
        </Button>
      </HStack>

      {customerList && customerList.length > 0 ?
        (
          <Table variant={'striped'}>
            <Thead>
              <Tr>
                <Th>Prénom</Th>
                <Th>Nom</Th>
                <Th>Age</Th>

                <Th>Téléphone</Th>
                <Th>Email</Th>
                <Th>Commentaire</Th>
              </Tr>
            </Thead>
            <Tbody>
              {customerList.map((customer, i) => (
                <Tr key={`entity-${i}`} data-cy="entityTable">
                  <Td>{customer.firstname}</Td>
                  <Td>{customer.lastname}</Td>
                  <Td>{customer.age}</Td>
                  <Td>{customer.phoneNumber}</Td>
                  <Td>
                    <Button as={Link} to={`${customer.id}`} variant={'see'} size="sm">
                      {customer.email}
                    </Button>
                  </Td>
                  <Td>{customer.comment}</Td>
                  <Td className="text-right">
                    <HStack spacing={0}>
                      <Button
                        as={Link}
                        variant="see"
                        to={`${customer.id}`}
                        size="sm"
                        leftIcon={<FaEye />}
                        borderRightRadius={0}
                      >
                        Voir
                      </Button>
                      <Button
                        as={Link}
                        variant="modify"
                        to={`${customer.id}/edit`}
                        size="sm"
                        borderRadius={0}
                        leftIcon={<FaPencilAlt />}
                      >
                        Modifier
                      </Button>
                      <CustomerDeleteDialog
                        // @ts-expect-error TODO: fix this
                        customerId={customer.id}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) :
        (!loading && <div className="alert alert-warning">Aucun client trouvé</div>)}
    </VStack>
  )
}
