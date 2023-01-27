import './home.scss'

import { Box, Button, HStack, Image, Text, VStack } from '@chakra-ui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AUTHORITIES } from 'app/config/constants'
import { useAppSelector } from 'app/config/store'
import { hasAnyAuthority } from 'app/shared/auth/private-route'
import { pipe } from 'effect'
import * as O from 'fp-ts/lib/Option'
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
  console.log(isIntermittent)
  const account = useAppSelector(state => state.authentication.account)
  console.log(account)
  const reservationCreationIntermittentUrl = pipe(
    account.customerId,
    O.fromNullable,
    O.fold(
      () => `bookingbeds/new/intermittent`,
      customerId => `bookingbeds/new/intermittent/${customerId}`
    )
  )
  console.log(reservationCreationIntermittentUrl)
  const reservationRequestUrl = 'reservation-request/new'

  async function copyLink(): Promise<void> {
    await navigator.clipboard.writeText(location.href + reservationRequestUrl)
  }
  if (process.env.NODE_ENV === 'development') {
    console.log('Happy developing!')
  }
  if (process.env.NODE_ENV === 'production') {
    console.log('Happy production!')
  }
  return (
    <HStack>
      <Box>
        <Image
          src="../../../content/images/campus.webp"
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
        {isIntermittent ?
          (
            <Button
              as={Link}
              to={reservationCreationIntermittentUrl}
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
