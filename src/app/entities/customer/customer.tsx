import { Button, Heading, HStack, VStack } from '@chakra-ui/react'
import { faEye, faPencilAlt, faPlus, faSync, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Table } from 'reactstrap'

import { getEntities } from './customer.reducer'

export const Customer = () => {
  const dispatch = useAppDispatch()

  const customerList = useAppSelector(state => state.customer.entities)
  const loading = useAppSelector(state => state.customer.loading)

  useEffect(() => {
    dispatch(getEntities())
  }, [])

  const handleSyncList = () => {
    dispatch(getEntities())
  }

  return (
    <VStack>
      <Heading>Clients</Heading>
      <HStack alignSelf={'right'}>
        <Button
          onClick={handleSyncList}
          disabled={loading}
          isLoading={loading}
          leftIcon={<FontAwesomeIcon icon={faSync} />}
        >
          Rafraîchir la liste
        </Button>
        <Link
          to={`new`}
          className="btn btn-primary jh-create-entity"
          id="jh-create-entity"
          data-cy="entityCreateButton"
        >
          <FontAwesomeIcon icon={faPlus} />
          &nbsp; Créez un nouveau client
        </Link>
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
                          to={`${customer.id}`}
                          color="info"
                          size="sm"
                          data-cy="entityDetailsButton"
                        >
                          <FontAwesomeIcon icon={faEye} />{' '}
                          <span className="d-none d-md-inline">Voir</span>
                        </Button>
                        <Button
                          as={Link}
                          to={`${customer.id}/edit`}
                          color="primary"
                          size="sm"
                          data-cy="entityEditButton"
                        >
                          <FontAwesomeIcon icon={faPencilAlt} />{' '}
                          <span className="d-none d-md-inline">Modifier</span>
                        </Button>
                        <Button
                          as={Link}
                          to={`${customer.id}/delete`}
                          color="danger"
                          size="sm"
                          data-cy="entityDeleteButton"
                        >
                          <FontAwesomeIcon icon={faTrash} />{' '}
                          <span className="d-none d-md-inline">Suppimer</span>
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

export default Customer
