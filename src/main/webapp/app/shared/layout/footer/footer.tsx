import './footer.scss';

import React from 'react';

import { Col, Row } from 'reactstrap';
import { Link } from 'react-router-dom';

const Footer = props => (
  <div className="footer page-content">
    <Row>
      <Col md="12">
        <p>
          Développé par <a href="https://herve-caujolle.fr">Hervé Caujolle</a> et <a href="https://charles.ilieff.fr">Charles Ilieff</a>.
        </p>{' '}
        <p>
          Ce site n’utilise pas de cookies tiers. Lien vers les{' '}
          <Link to="/rgpd">mentions légales de traitement des données personnelles.</Link>.
        </p>
      </Col>
    </Row>
  </div>
);

export default Footer;
