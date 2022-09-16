import React, { useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import {} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getEntity } from './bedroom-kind.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

export const BedroomKindDetail = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getEntity(props.match.params.id));
  }, []);

  const bedroomKindEntity = useAppSelector(state => state.bedroomKind.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="bedroomKindDetailsHeading">Type de chambre</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">Nom</span>
          </dt>
          <dd>{bedroomKindEntity.name}</dd>
          <dt>
            <span id="description">Description</span>
          </dt>
          <dd>{bedroomKindEntity.description}</dd>
        </dl>
        <Button tag={Link} to="/bedroom-kind" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Retour</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/bedroom-kind/${bedroomKindEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Modifier</span>
        </Button>
      </Col>
    </Row>
  );
};

export default BedroomKindDetail;
