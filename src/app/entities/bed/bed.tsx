import { Heading } from '@chakra-ui/react'
import { faEye, faPencilAlt, faPlus, faSync, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { PlaceMenu } from 'app/shared/layout/menus/placeMenu'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, Table } from 'reactstrap'

import { getEntities } from './bed.reducer'

export const Bed = () => {
  const dispatch = useAppDispatch()

  const bedList = useAppSelector(state => state.bed.entities)
  const loading = useAppSelector(state => state.bed.loading)

  useEffect(() => {
    dispatch(getEntities())
  }, [])

  const handleSyncList = () => {
    dispatch(getEntities())
  }

  return (
    <div>
      <h2 id="bed-heading" data-cy="BedHeading">
        <Heading>Liste des lits</Heading>
        <div className="d-flex justify-content-end">
          <Button className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon={faSync} spin={loading} /> Rafraichîr la liste
          </Button>
          <Link
            to={`new`}
            className="btn btn-primary jh-create-entity"
            id="jh-create-entity"
            data-cy="entityCreateButton"
          >
            <FontAwesomeIcon icon={faPlus} />
            &nbsp; Créez un nouveau lit
          </Link>
        </div>
      </h2>

      <PlaceMenu />

      <div className="table-responsive">
        {bedList && bedList.length > 0 ?
          (
            <Table responsive>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Numéro</th>
                  <th>Nombre de places</th>
                  <th>Chambre</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {bedList.map((bed, i) => (
                  <tr key={`entity-${i}`} data-cy="entityTable">
                    <td>{bed.kind}</td>
                    <td>
                      <Button tag={Link} to={`${bed.id}`} color="link" size="sm">
                        {bed.number}
                      </Button>
                    </td>

                    <td>{bed.numberOfPlaces}</td>
                    <td>
                      {bed.room ? <Link to={`/room/${bed.room.id}`}>{bed.room.name}</Link> : ''}
                    </td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button
                          tag={Link}
                          to={`${bed.id}`}
                          color="info"
                          size="sm"
                          data-cy="entityDetailsButton"
                        >
                          <FontAwesomeIcon icon={faEye} />{' '}
                          <span className="d-none d-md-inline">Voir</span>
                        </Button>
                        <Button
                          tag={Link}
                          to={`${bed.id}/edit`}
                          color="primary"
                          size="sm"
                          data-cy="entityEditButton"
                        >
                          <FontAwesomeIcon icon={faPencilAlt} />{' '}
                          <span className="d-none d-md-inline">Modifier</span>
                        </Button>
                        <Button
                          tag={Link}
                          to={`${bed.id}/delete`}
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
          (!loading && <div className="alert alert-warning">Pas de lits trouvés</div>)}
      </div>
    </div>
  )
}
