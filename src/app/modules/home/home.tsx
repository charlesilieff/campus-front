import './home.scss'

import { Box, Button, HStack, Image, Text, VStack } from '@chakra-ui/react'
import { pipe } from '@effect-ts/core'
import * as O from '@effect-ts/core/Option'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AUTHORITIES } from 'app/config/constants'
import { useAppSelector } from 'app/config/store'
import { hasAnyAuthority } from 'app/shared/auth/private-route'
import React from 'react'
import { Link } from 'react-router-dom'

import RGPDAnonymizeData from '../rgpd/rgpdAnonymizeData'

export const Home = (): JSX.Element => {
  const isAdmin = useAppSelector(state =>
    hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN])
  )
  const isIntermittent = useAppSelector(state =>
    hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.INTERMITTENT])
  )
  const account = useAppSelector(state => state.authentication.account)

  const reservationCreationIntermittentUrl = pipe(
    account.customerId,
    O.fromNullable,
    O.map(customerId => `bookingbeds/new/intermittent/${customerId}`)
  )
  const reservationRequestUrl = 'reservation-request/new'

  async function copyLink(): Promise<void> {
    await navigator.clipboard.writeText(location.href + reservationRequestUrl)
  }

  return (
    <HStack>
      <Box>
        <Image
          src="../../../content/images/campus.png"
          w={'500px'}
          h={'300px'}
          objectFit="contain"
        />
      </Box>
      <VStack alignItems={'flex-start'}>
        <Text>
          Bienvenue dans l&apos;outil de gestion d&apos;hebergement du Campus de la Transition.
        </Text>
        <Box backgroundColor={'blue.100'} p={5}>
          <VStack alignItems={'flex-start'}>
            <Box>
              Vous vous voulez voir la page de demande de réservation publique ?{' '}
              <Link target="_blank" data-cy="reservation-request" to={reservationRequestUrl}>
                Cliquez ici.
              </Link>
            </Box>
            <Button
              id="jhi-copy-link-request-reservation"
              data-cy="entityCopyLink"
              colorScheme={'blue'}
              onClick={copyLink}
            >
              <FontAwesomeIcon icon="copy" />
              &nbsp; Copier le lien de demande de réservation
            </Button>
          </VStack>
        </Box>
        <p></p>

        {account && account.login ?
          (
            <Box backgroundColor={'blue.100'} p={5}>
              Vous êtes connecté comme {account.login}.
            </Box>
          ) :
          null}
        {isIntermittent && O.isSome(reservationCreationIntermittentUrl) ?
          (
            <Button
              as={Link}
              to={reservationCreationIntermittentUrl.value}
              colorScheme={'green'}
              _hover={{ textDecoration: 'none', color: 'gray.900', backgroundColor: 'green.300' }}
            >
              Nouvelle réservation
            </Button>
          ) :
          ''}
        {isAdmin ? <RGPDAnonymizeData /> : ''}
      </VStack>
    </HStack>
  )
}

export default Home
