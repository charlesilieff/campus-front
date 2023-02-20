import { Heading } from '@chakra-ui/react'
import { faEye, faPencilAlt, faPlus, faSync, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { byteSize, openFile } from 'react-jhipster'
import { Link } from 'react-router-dom'
import { Button, Table } from 'reactstrap'

import { getEntities } from './place.reducer'

export const Place = () => {
  const dispatch = useAppDispatch()

  const placeList = useAppSelector(state => state.place.entities)
  const loading = useAppSelector(state => state.place.loading)

  useEffect(() => {
    dispatch(getEntities())
  }, [])

  const handleSyncList = () => {
    dispatch(getEntities())
  }

  return (
    <div>
      <h2 id="place-heading" data-cy="PlaceHeading">
        <Heading>Lieux</Heading>
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
                      <Button tag={Link} to={`${place.id}`} color="link" size="sm">
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
                          to={`${place.id}`}
                          color="info"
                          size="sm"
                          data-cy="entityDetailsButton"
                        >
                          <FontAwesomeIcon icon={faEye} />{' '}
                          <span className="d-none d-md-inline">Voir</span>
                        </Button>
                        <Button
                          tag={Link}
                          to={`${place.id}/edit`}
                          color="primary"
                          size="sm"
                          data-cy="entityEditButton"
                        >
                          <FontAwesomeIcon icon={faPencilAlt} />{' '}
                          <span className="d-none d-md-inline">Modifier</span>
                        </Button>
                        <Button
                          tag={Link}
                          to={`${place.id}/delete`}
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
          (!loading && <div className="alert alert-warning">Aucun lieu trouvé</div>)}
      </div>
    </div>
  )
}
