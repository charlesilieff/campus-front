import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Button, Table } from 'reactstrap'

import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getEntities } from './customer.reducer'

export const Customer = (props: RouteComponentProps<{ url: string }>) => {
  const dispatch = useAppDispatch()

  const customerList = useAppSelector(state => state.customer.entities)
  const loading = useAppSelector(state => state.customer.loading)

  useEffect(() => {
    dispatch(getEntities())
  }, [])

  const handleSyncList = () => {
    dispatch(getEntities())
  }

  const { match } = props

  return (
    <div>
      <h2 id="customer-heading" data-cy="CustomerHeading">
        Clients
        <div className="d-flex justify-content-end">
          <Button className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} /> Rafraichîr la liste
          </Button>
          <Link
            to={`${match.url}/new`}
            className="btn btn-primary jh-create-entity"
            id="jh-create-entity"
            data-cy="entityCreateButton"
          >
            <FontAwesomeIcon icon="plus" />
            &nbsp; Créez un nouveau client
          </Link>
        </div>
      </h2>
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
                    {/* <td>{customer.isFemal ? 'Femme' : 'Homme'}</td> */}
                    <td>{customer.phoneNumber}</td>
                    <td>
                      <Button tag={Link} to={`${match.url}/${customer.id}`} color="link" size="sm">
                        {customer.email}
                      </Button>
                    </td>
                    <td>{customer.comment}</td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button
                          tag={Link}
                          to={`${match.url}/${customer.id}`}
                          color="info"
                          size="sm"
                          data-cy="entityDetailsButton"
                        >
                          <FontAwesomeIcon icon="eye" />{' '}
                          <span className="d-none d-md-inline">Voir</span>
                        </Button>
                        <Button
                          tag={Link}
                          to={`${match.url}/${customer.id}/edit`}
                          color="primary"
                          size="sm"
                          data-cy="entityEditButton"
                        >
                          <FontAwesomeIcon icon="pencil-alt" />{' '}
                          <span className="d-none d-md-inline">Modifier</span>
                        </Button>
                        <Button
                          tag={Link}
                          to={`${match.url}/${customer.id}/delete`}
                          color="danger"
                          size="sm"
                          data-cy="entityDeleteButton"
                        >
                          <FontAwesomeIcon icon="trash" />{' '}
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
    </div>
  )
}

export default Customer
