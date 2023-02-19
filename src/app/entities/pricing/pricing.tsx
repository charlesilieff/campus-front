import { Heading } from '@chakra-ui/react'
import { faEye, faPencilAlt, faPlus, faSync, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, Table } from 'reactstrap'

import { getEntities } from './pricing.reducer'

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
    <div>
      <h2 id="pricing-heading" data-cy="PricingHeading">
        <Heading>Tarifs</Heading>
        <div className="d-flex justify-content-end">
          <Button className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon={faSync} spin={loading} /> Rafraîchir la liste
          </Button>
          <Link
            to={`new`}
            className="btn btn-primary jh-create-entity"
            id="jh-create-entity"
            data-cy="entityCreateButton"
          >
            <FontAwesomeIcon icon={faPlus} />
            &nbsp; Créez un nouveau tarif
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {pricingList && pricingList.length > 0 ?
          (
            <Table responsive>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Prix</th>
                  <th>Commentaire</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {pricingList.map((pricing, i) => (
                  <tr key={`entity-${i}`} data-cy="entityTable">
                    <td>
                      <Button tag={Link} to={`${pricing.id}`} color="link" size="sm">
                        {pricing.wording}
                      </Button>
                    </td>
                    <td>{pricing.price}</td>
                    <td>{pricing.comment}</td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button
                          tag={Link}
                          to={`${pricing.id}`}
                          color="info"
                          size="sm"
                          data-cy="entityDetailsButton"
                        >
                          <FontAwesomeIcon icon={faEye} />{' '}
                          <span className="d-none d-md-inline">Voir</span>
                        </Button>
                        <Button
                          tag={Link}
                          to={`${pricing.id}/edit`}
                          color="primary"
                          size="sm"
                          data-cy="entityEditButton"
                        >
                          <FontAwesomeIcon icon={faPencilAlt} />{' '}
                          <span className="d-none d-md-inline">Modifier</span>
                        </Button>
                        <Button
                          tag={Link}
                          to={`${pricing.id}/delete`}
                          color="danger"
                          size="sm"
                          data-cy="entityDeleteButton"
                        >
                          <FontAwesomeIcon icon={faTrash} />{' '}
                          <span className="d-none d-md-inline">Supprimer</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) :
          (!loading && <div className="alert alert-warning">No Pricing found</div>)}
      </div>
    </div>
  )
}
