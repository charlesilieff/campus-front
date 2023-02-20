import { Heading } from '@chakra-ui/react'
import { faEye, faPencilAlt, faPlus, faSync, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { PlaceMenu } from 'app/shared/layout/menus/placeMenu'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, Table } from 'reactstrap'

import { getEntities } from './bedroom-kind.reducer'

export const BedroomKind = () => {
  const dispatch = useAppDispatch()

  const bedroomKindList = useAppSelector(state => state.bedroomKind.entities)
  const loading = useAppSelector(state => state.bedroomKind.loading)

  useEffect(() => {
    dispatch(getEntities())
  }, [])

  const handleSyncList = () => {
    dispatch(getEntities())
  }

  return (
    <div>
      <h2 id="bedroom-kind-heading" data-cy="BedroomKindHeading">
        <Heading>Type de chambre</Heading>
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
            &nbsp; Créez un nouveau type de chambre
          </Link>
        </div>
      </h2>
      <PlaceMenu />
      <div className="table-responsive">
        {bedroomKindList && bedroomKindList.length > 0 ?
          (
            <Table responsive>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Description</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {bedroomKindList.map((bedroomKind, i) => (
                  <tr key={`entity-${i}`} data-cy="entityTable">
                    <td>
                      <Button
                        tag={Link}
                        to={`${bedroomKind.id}`}
                        color="link"
                        size="sm"
                      >
                        {bedroomKind.name}
                      </Button>
                    </td>

                    <td>{bedroomKind.description}</td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button
                          tag={Link}
                          to={`${bedroomKind.id}`}
                          color="info"
                          size="sm"
                          data-cy="entityDetailsButton"
                        >
                          <FontAwesomeIcon icon={faEye} />{' '}
                          <span className="d-none d-md-inline">Voir</span>
                        </Button>
                        <Button
                          tag={Link}
                          to={`${bedroomKind.id}/edit`}
                          color="primary"
                          size="sm"
                          data-cy="entityEditButton"
                        >
                          <FontAwesomeIcon icon={faPencilAlt} />{' '}
                          <span className="d-none d-md-inline">Modifier</span>
                        </Button>
                        <Button
                          tag={Link}
                          to={`${bedroomKind.id}/delete`}
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
          (!loading && <div className="alert alert-warning">Aucun type de chambre trouvé.</div>)}
      </div>
    </div>
  )
}
