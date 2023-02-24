import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Box, HStack, Link as ChakraLink, Text } from '@chakra-ui/react'
import React from 'react'
import { FaHome } from 'react-icons/fa'
import { NavLink as Link } from 'react-router-dom'
import { NavLink } from 'reactstrap'

const logo = new URL('../../../../content/images/logo-Campus-2018.png', import.meta.url).href
export const BrandIcon = props => (
  <div {...props} className="brand-icon">
    <img src={logo} alt="Logo" />
  </div>
)

export const Brand = _ => (
  <Box as={Link} to="/" className="brand-logo">
    <BrandIcon />
    <span className="brand-title">Gestion de l&apos;hébergement</span>
    {/* <span className="navbar-version">{appConfig.VERSION}</span> */}
  </Box>
)

export const Home = () => (
  <ChakraLink
    _hover={{ color: 'white', textDecoration: 'none' }}
    as={NavLink}
    to="/"
    verticalAlign={'center'}
    p={2}
  >
    <HStack color="white">
      <FaHome /> <Text>Accueil</Text>
    </HStack>
  </ChakraLink>
)

export const Help = () => (
  <ChakraLink
    _hover={{ color: 'white', textDecoration: 'none' }}
    verticalAlign={'center'}
    p={2}
    color="white"
    isExternal
    href="https://docs.google.com/document/d/1cn06oT9xgk26M6tQDHyq9GNug_EHe_sD9bxa-Wbl_X0/edit?usp=sharing"
  >
    <InfoOutlineIcon /> Aide
  </ChakraLink>
)
