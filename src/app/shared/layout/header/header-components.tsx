import React from 'react';

import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Link as ChakraLink } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import appConfig from 'app/config/constants';
import { NavLink as Link } from 'react-router-dom';
import { NavbarBrand, NavLink } from 'reactstrap';

export const BrandIcon = props => (
  <div {...props} className="brand-icon">
    <img src="content/images/logo-Campus-2018.png" alt="Logo" />
  </div>
);

export const Brand = props => (
  <NavbarBrand tag={Link} to="/" className="brand-logo">
    <BrandIcon />
    <span className="brand-title">Gestion de l&apos;hébergement</span>
    <span className="navbar-version">{appConfig.VERSION}</span>
  </NavbarBrand>
);

export const Home = props => (
  <ChakraLink>
    <NavLink tag={Link} to="/" className="d-flex align-items-center">
      <FontAwesomeIcon icon="home" />
      <span>Acceuil</span>
    </NavLink>
    </ChakraLink>
);

export const Help = _ => (

  <ChakraLink _hover={{color:"white"}} verticalAlign={"center"} p={2} color='white' isExternal href="https://docs.google.com/document/d/1cn06oT9xgk26M6tQDHyq9GNug_EHe_sD9bxa-Wbl_X0/edit?usp=sharing">
    <InfoOutlineIcon/> <span>Aide</span>
    
  </ChakraLink>

);
