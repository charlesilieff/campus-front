import React, { useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { openFile, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getEntity } from './place.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

export const PlaceDetail = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getEntity(props.match.params.id));
  }, []);

  const placeEntity = useAppSelector(state => state.place.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="placeDetailsHeading">Lieu</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">Nom</span>
          </dt>
          <dd>{placeEntity.name}</dd>
          <dt>
            <span id="comment">Commentaire</span>
          </dt>
          <dd>{placeEntity.comment}</dd>
          <dt>
            <span id="image">Image</span>
          </dt>
          <dd>
            {placeEntity.image ? (
              <div>
                {placeEntity.imageContentType ? (
                  <a onClick={openFile(placeEntity.imageContentType, placeEntity.image)}>
                    <img src={`data:${placeEntity.imageContentType};base64,${placeEntity.image}`} style={{ maxHeight: '30px' }} />
                  </a>
                ) : null}
                <span>
                  {placeEntity.imageContentType}, {byteSize(placeEntity.image)}
                </span>
              </div>
            ) : null}
          </dd>
        </dl>
        <Button tag={Link} to="/place" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Retour</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/place/${placeEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Modifier</span>
        </Button>
      </Col>
    </Row>
  );
};

export default PlaceDetail;
