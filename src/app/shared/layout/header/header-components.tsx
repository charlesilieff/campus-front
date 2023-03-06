import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Box, Heading, HStack, Image, Link as ChakraLink, Text } from '@chakra-ui/react'
import React from 'react'
import { FaHome } from 'react-icons/fa'
import { NavLink as Link } from 'react-router-dom'

const logo = new URL('../../../../content/images/logo-Campus-2018.png', import.meta.url).href

export const Brand = () => (
  <Box as={Link} to="/" className="brand-logo">
    <HStack>
      <Image src={logo} alt="Logo" w="130px" h="50px" objectFit="contain" />

      <Heading color={'white'} size="lg" px={8}>Gestion de l&apos;hébergement</Heading>
    </HStack>
  </Box>
)

export const Home = () => (
  <ChakraLink
    _hover={{ color: 'white', textDecoration: 'none' }}
    as={Link}
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
