import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { byteSize, openFile, Translate } from 'react-jhipster'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Button, Col, Row, Table } from 'reactstrap'

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { IPlace } from 'app/shared/model/place.model'
import { getEntities } from './place.reducer'

export const Place = (props: RouteComponentProps<{ url: string }>) => {
  const dispatch = useAppDispatch()

  const placeList = useAppSelector(state => state.place.entities)
  const loading = useAppSelector(state => state.place.loading)

  useEffect(() => {
    dispatch(getEntities({}))
  }, [])

  const handleSyncList = () => {
    dispatch(getEntities({}))
  }

  const { match } = props

  return (
    <div>
      <h2 id="place-heading" data-cy="PlaceHeading">
        Lieux
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
            &nbsp; Créez un nouveau lieu
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {placeList && placeList.length > 0 ?
          (
            <Table responsive>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Commentaire</th>
                  <th>Image</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {placeList.map((place, i) => (
                  <tr key={`entity-${i}`} data-cy="entityTable">
                    <td>
                      <Button tag={Link} to={`${match.url}/${place.id}`} color="link" size="sm">
                        {place.name}
                      </Button>
                    </td>
                    <td>{place.comment}</td>
                    <td>
                      {place.image ?
                        (
                          <div>
                            {place.imageContentType ?
                              (
                                <a onClick={openFile(place.imageContentType, place.image)}>
                                  <img
                                    src={`data:${place.imageContentType};base64,${place.image}`}
                                    style={{ maxHeight: '30px' }}
                                  />
                                  &nbsp;
                                </a>
                              ) :
                              null}
                            <span>
                              {place.imageContentType}, {byteSize(place.image)}
                            </span>
                          </div>
                        ) :
                        null}
                    </td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button
                          tag={Link}
                          to={`${match.url}/${place.id}`}
                          color="info"
                          size="sm"
                          data-cy="entityDetailsButton"
                        >
                          <FontAwesomeIcon icon="eye" />{' '}
                          <span className="d-none d-md-inline">Voir</span>
                        </Button>
                        <Button
                          tag={Link}
                          to={`${match.url}/${place.id}/edit`}
                          color="primary"
                          size="sm"
                          data-cy="entityEditButton"
                        >
                          <FontAwesomeIcon icon="pencil-alt" />{' '}
                          <span className="d-none d-md-inline">Modifier</span>
                        </Button>
                        <Button
                          tag={Link}
                          to={`${match.url}/${place.id}/delete`}
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
          (!loading && <div className="alert alert-warning">Aucun lieu trouvé</div>)}
      </div>
    </div>
  )
}

export default Place
