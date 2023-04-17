import './home.scss'

import { CopyIcon } from '@chakra-ui/icons'
import { Box, Button, HStack, Image, Text, VStack } from '@chakra-ui/react'
import { AUTHORITIES } from 'app/config/constants'
import { useAppSelector } from 'app/config/store'
import { hasAnyAuthority } from 'app/shared/auth/private-route'
import React from 'react'
import { BsPlusCircleFill } from 'react-icons/bs'
import { Link } from 'react-router-dom'

import { ReservationsToBeProcessed } from '../reservation-to-be-processed/reservationtobeprocessed'
import { RGPDAnonymizeData } from '../rgpd/rgpdAnonymizeData'

export const Home = (): JSX.Element => {
  const isAdmin = useAppSelector(state =>
    hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN])
  )
  const isIntermittent = useAppSelector(state =>
    hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.INTERMITTENT])
  )
  // const isHabitant = useAppSelector(state =>
  //   hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.HABITANT])
  // )

  const isRespHebergement = useAppSelector(state =>
    hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.RESPHEBERGEMENT])
  )
  const account = useAppSelector(state => state.authentication.account)

  const reservationCreationIntermittentUrl = `bookingbeds/new/intermittent`
  const reservationCreationHabitantUrl = `bookingbeds/new/habitant`

  const reservationRequestUrl = 'reservation-request/new'

  async function copyLink(): Promise<void> {
    await navigator.clipboard.writeText(location.href + reservationRequestUrl)
  }
  if (process.env.NODE_ENV === 'development') {
    console.log('Happy developing!!!')
  }
  if (process.env.NODE_ENV === 'production') {
    console.log('Happy production!!!')
  }
  const campus = new URL('../../../content/images/campus.webp', import.meta.url).href
  return (
    <HStack>
      <Box>
        <Image
          src={campus}
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
              leftIcon={<CopyIcon />}
            >
              Copier le lien de demande de réservation
            </Button>
          </VStack>
        </Box>

        {account && account.login ?
          (
            <Box backgroundColor={'blue.100'} p={5}>
              Vous êtes connecté comme {account.login}.
            </Box>
          ) :
          null}
        {isIntermittent ?
          (
            <Box
              py={'10px'}
              px={'25px'}
              backgroundColor={'#C6F6D5'}
              borderLeft={'4px'}
              borderColor={'#38A169'}
              minW={'650px'}
            >
              <HStack justifyContent={'space-between'}>
                <VStack alignItems={'flex-start'}>
                  <HStack>
                    <BsPlusCircleFill color="#38A169" size={'24px'} />
                    <Text fontWeight={'bold'}>Nouvelle réservation personnelle</Text>
                  </HStack>
                </VStack>
                <Button
                  as={Link}
                  to={reservationCreationIntermittentUrl}
                  colorScheme={'green'}
                  _hover={{
                    textDecoration: 'none',
                    color: 'white',
                    backgroundColor: '#38A169'
                  }}
                >
                  Créer une réservation
                </Button>
              </HStack>
            </Box>
          ) :
          ''}
        {isAdmin ?
          (
            <Box
              py={'10px'}
              px={'25px'}
              backgroundColor={'#C6F6D5'}
              borderLeft={'4px'}
              borderColor={'#38A169'}
              minW={'650px'}
            >
              <HStack justifyContent={'space-between'}>
                <VStack alignItems={'flex-start'}>
                  <HStack>
                    <BsPlusCircleFill color="#38A169" size={'24px'} />
                    <Text fontWeight={'bold'}>Nouvelle réservation pour un habitant</Text>
                  </HStack>
                </VStack>
                <Button
                  as={Link}
                  to={reservationCreationHabitantUrl}
                  colorScheme={'green'}
                  _hover={{
                    textDecoration: 'none',
                    color: 'white',
                    backgroundColor: '#38A169'
                  }}
                >
                  Créer une réservation
                </Button>
              </HStack>
            </Box>
          ) :
          ''}

        {isRespHebergement ? <ReservationsToBeProcessed /> : ''}
        {isAdmin ? <RGPDAnonymizeData /> : ''}
      </VStack>
    </HStack>
  )
}
