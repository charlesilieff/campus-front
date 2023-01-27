import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Link as ChakraLink } from '@chakra-ui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import appConfig from 'app/config/constants'
import React from 'react'
import { NavLink as Link } from 'react-router-dom'
import { NavbarBrand, NavLink } from 'reactstrap'

const logo = new URL('../../../../content/images/logo-Campus-2018.png', import.meta.url).href
export const BrandIcon = props => (
  <div {...props} className="brand-icon">
    <img src={logo} alt="Logo" />
  </div>
)

export const Brand = _ => (
  <NavbarBrand tag={Link} to="/" className="brand-logo">
    <BrandIcon />
    <span className="brand-title">Gestion de l&apos;hébergement</span>
    {/* <span className="navbar-version">{appConfig.VERSION}</span> */}
  </NavbarBrand>
)

export const Home = _ => (
  <ChakraLink>
    <NavLink tag={Link} to="/" className="d-flex align-items-center">
      <FontAwesomeIcon icon="home" />
      <span>Accueil</span>
    </NavLink>
  </ChakraLink>
)

export const Help = _ => (
  <ChakraLink
    _hover={{ color: 'white' }}
    verticalAlign={'center'}
    p={2}
    color="white"
    isExternal
    href="https://docs.google.com/document/d/1cn06oT9xgk26M6tQDHyq9GNug_EHe_sD9bxa-Wbl_X0/edit?usp=sharing"
  >
    <InfoOutlineIcon /> <span>Aide</span>
  </ChakraLink>
)
