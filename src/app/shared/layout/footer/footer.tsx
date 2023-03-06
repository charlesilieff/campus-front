import './footer.scss'

import { HStack, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'

export const Footer = () => (
  <VStack alignItems={'flex-start'} px={4}>
    <HStack>
      <Text>
        Développé par <a href="https://herve-caujolle.fr">Hervé Caujolle</a> et{' '}
        <a href="https://charles.ilieff.fr">Charles Ilieff</a>.
      </Text>{' '}
      <Text>Version {process.env.npm_package_version}</Text>
    </HStack>

    <p>
      Ce site n’utilise pas de cookies tiers. Lien vers les{' '}
      <Link to="/rgpd">mentions légales de traitement des données personnelles.</Link>.
    </p>
  </VStack>
)
