import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { Translate } from 'react-jhipster'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Button, Col, Row, Table } from 'reactstrap'

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { IPricing } from 'app/shared/model/pricing.model'
import { getEntities } from './pricing.reducer'

export const Pricing = (props: RouteComponentProps<{ url: string }>) => {
  const dispatch = useAppDispatch()

  const pricingList = useAppSelector(state => state.pricing.entities)
  const loading = useAppSelector(state => state.pricing.loading)

  useEffect(() => {
    dispatch(getEntities({}))
  }, [])

  const handleSyncList = () => {
    dispatch(getEntities({}))
  }

  const { match } = props

  return (
    <div>
      <h2 id="pricing-heading" data-cy="PricingHeading">
        Tarifs
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
                      <Button tag={Link} to={`${match.url}/${pricing.id}`} color="link" size="sm">
                        {pricing.wording}
                      </Button>
                    </td>
                    <td>{pricing.price}</td>
                    <td>{pricing.comment}</td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button
                          tag={Link}
                          to={`${match.url}/${pricing.id}`}
                          color="info"
                          size="sm"
                          data-cy="entityDetailsButton"
                        >
                          <FontAwesomeIcon icon="eye" />{' '}
                          <span className="d-none d-md-inline">Voir</span>
                        </Button>
                        <Button
                          tag={Link}
                          to={`${match.url}/${pricing.id}/edit`}
                          color="primary"
                          size="sm"
                          data-cy="entityEditButton"
                        >
                          <FontAwesomeIcon icon="pencil-alt" />{' '}
                          <span className="d-none d-md-inline">Modifier</span>
                        </Button>
                        <Button
                          tag={Link}
                          to={`${match.url}/${pricing.id}/delete`}
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
          (!loading && <div className="alert alert-warning">No Pricings found</div>)}
      </div>
    </div>
  )
}

export default Pricing
