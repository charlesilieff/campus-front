import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { PlaceMenu } from 'app/shared/layout/menus/placeMenu';
import React, { useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { getEntities } from './room.reducer';

export const Room = (props: RouteComponentProps<{ url: string }>) => {
  const dispatch = useAppDispatch();

  const roomList = useAppSelector(state => state.room.entities);
  const loading = useAppSelector(state => state.room.loading);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
  };

  const { match } = props;

  return (
    <div>
      <h2 id="room-heading" data-cy="RoomHeading">
        Chambres / Lieux de couchage
        <div className="d-flex justify-content-end">
          <Button className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} /> Rafraîchir
          </Button>
          <Link to={`${match.url}/new`} className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp; Créer une chambre
          </Link>
        </div>
      </h2>
      <PlaceMenu />
      <div className="table-responsive">
        {roomList && roomList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>Nom / Numéro</th>
                <th>Commentaire</th>
                <th>Type de chambre</th>
                <th>Emplacement de la chambre</th>
                <th>Nombre de lits</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {roomList.map((room, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    {' '}
                    <Button tag={Link} to={`${match.url}/${room.id}`} color="link" size="sm">
                      {room.name}
                    </Button>
                  </td>
                  <td>{room.comment}</td>
                  <td>{room.bedroomKind ? <Link to={`bedroom-kind/${room.bedroomKind.id}`}>{room.bedroomKind.name}</Link> : ''}</td>
                  <td>{room.place ? <Link to={`place/${room.place.id}`}>{room.place.name}</Link> : ''}</td>
                  <td>{room.beds?.length}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${room.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">Voir</span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${room.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Editer</span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${room.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Supprimer</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && <div className="alert alert-warning">Pas de chambres crées.</div>
        )}
      </div>
    </div>
  );
};

export default Room;
