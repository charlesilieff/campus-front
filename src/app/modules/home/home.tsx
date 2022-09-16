import './home.scss';

import React from 'react';
import { Link } from 'react-router-dom';

import { Row, Col, Alert, Button } from 'reactstrap';

import { useAppSelector } from 'app/config/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';
import RGPDAnonymizeData from '../rgpd/rgpdAnonymizeData';

export const Home = () => {
  const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]));
  const account = useAppSelector(state => state.authentication.account);

  const reservationRequestUrl = 'reservation-request/new';

  async function copyLink() {
    await navigator.clipboard.writeText(location.href + reservationRequestUrl);
  }

  return (
    <Row>
      <Col md="3" className="pad">
        <span className="hipster rounded" />
      </Col>
      <Col md="9">
        <h2>Bienvenue dans l&apos;outil de gestion d&apos;hebergement du Campus de la Transition.</h2>
        <Alert color="warning">
          <p>
            Vous vous voulez voir la page de demande de réservation ?{' '}
            <Link target="_blank" data-cy="reservation-request" to={reservationRequestUrl}>
              Cliquez ici.
            </Link>
          </p>
          <Button id="jhi-copy-link-request-reservation" data-cy="entityCopyLink" color="info" onClick={copyLink}>
            <FontAwesomeIcon icon="copy" />
            &nbsp; Copier le lien de demande de réservation
          </Button>
        </Alert>
        <p></p>
        <p className="lead">Ceci est la page d&apos;accueil pour le responsable d&apos;hébergement et l&apos;admin.</p>
        {account && account.login ? (
          <>
            <div>
              <Alert color="success">Vous êtes connecté comme {account.login}.</Alert>
            </div>
          </>
        ) : (
          <div></div>
        )}
        {isAdmin ? <RGPDAnonymizeData /> : ''}
      </Col>
    </Row>
  );
};

export default Home;
