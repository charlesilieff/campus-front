import { Button, Heading, HStack, VStack } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { FaEye, FaPencilAlt, FaPlus, FaTrash } from 'react-icons/fa'
import { HiRefresh } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import { Table } from 'reactstrap'

import { getEntities } from './customer.reducer'

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
          id="jh-create-entity"
          data-cy="entityCreateButton"
          leftIcon={<FaPlus />}
        >
          Créez un nouveau client
        </Button>
      </HStack>
      <div className="table-responsive">
        {customerList && customerList.length > 0 ?
          (
            <Table responsive>
              <thead>
                <tr>
                  <th>Prénom</th>
                  <th>Nom</th>
                  <th>Age</th>
                  {/* <th>Genre</th> */}
                  <th>Téléphone</th>
                  <th>Email</th>
                  <th>Commentaire</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {customerList.map((customer, i) => (
                  <tr key={`entity-${i}`} data-cy="entityTable">
                    <td>{customer.firstname}</td>
                    <td>{customer.lastname}</td>
                    <td>{customer.age}</td>
                    <td>{customer.phoneNumber}</td>
                    <td>
                      <Button as={Link} to={`${customer.id}`} color="link" size="sm">
                        {customer.email}
                      </Button>
                    </td>
                    <td>{customer.comment}</td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
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
                        <Button
                          as={Link}
                          variant="danger"
                          to={`${customer.id}/delete`}
                          size="sm"
                          borderLeftRadius={0}
                          leftIcon={<FaTrash />}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) :
          (!loading && <div className="alert alert-warning">Aucun client trouvé</div>)}
      </div>
    </VStack>
  )
}
