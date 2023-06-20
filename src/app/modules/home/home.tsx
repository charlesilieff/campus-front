import './home.scss'

import { CopyIcon } from '@chakra-ui/icons'
import { Box, Button, HStack, Image, Stack, Text, VStack } from '@chakra-ui/react'
import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import { AUTHORITIES } from 'app/config/constants'
import { useAppSelector } from 'app/config/store'
import { hasAnyAuthority } from 'app/shared/auth/private-route'
import React from 'react'
import { BsPlusCircleFill } from 'react-icons/bs'
import { Link } from 'react-router-dom'

import { ReservationsToBeProcessedButton } from '../reservation-to-be-processed/reservationtobeprocessed'
import { RGPDAnonymizeData } from '../rgpd/rgpdAnonymizeData'

export const Home = (): JSX.Element => {
  const isAdmin = useAppSelector(state =>
    hasAnyAuthority(state.authentication.account, [AUTHORITIES.ADMIN])
  )
  const isIntermittent = useAppSelector(state =>
    hasAnyAuthority(state.authentication.account, [AUTHORITIES.INTERMITTENT])
  )
  // const isHabitant = useAppSelector(state =>
  //   hasAnyAuthority(state.authentication.account, [AUTHORITIES.HABITANT])
  // )

  const isRespHebergement = useAppSelector(state =>
    hasAnyAuthority(state.authentication.account, [AUTHORITIES.RESPHEBERGEMENT])
  )
  const account = useAppSelector(state => state.authentication.account)

  const reservationCreationIntermittentUrl = `bookingbeds/new/intermittent`
  const reservationCreationHabitantUrl = `bookingbeds/new/habitant`
  const reservationCreationEmployeeUrl = `bookingbeds/new/employee`
  const reservationCreationCustomerUrl = `bookingbeds/new`
  // const reservationCreationInviteUrl = `bookingbeds/new/invite`

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
    <HStack mx={{ base: '-15px', md: '0px' }}>
      <Box>
        <Image
          src={campus}
          w={'500px'}
          h={'300px'}
          objectFit="contain"
        />
      </Box>
      <VStack alignItems={'flex-start'}>
        <Text
          width={'auto'}
        >
          Bienvenue dans l&apos;outil de gestion d&apos;hebergement du Campus de la Transition.
        </Text>
        <Box
          m={5}
        >
          <Box
            alignItems={'flex-start'}
            minW={{ base: '380px', md: '650px' }}
            backgroundColor={'blue.100'}
            p={5}
            width={'auto'}
          >
            <Stack
              justifyContent={'space-between'}
              direction={{ base: 'column', md: 'row' }}
            >
              <Box>
                Vous vous voulez voir la page de demande de réservation publique ?
              </Box>
              <Button
                id="jhi-link-request-reservation"
                colorScheme={'blue'}
                as={Link}
                to={reservationRequestUrl}
                width={'100px'}
                px={1}
                size={{ base: 'sm', md: 'md' }}
              >
                Cliquez ici.
              </Button>
            </Stack>
            <Box py={2}>
              <Button
                id="jhi-copy-link-request-reservation"
                data-cy="entityCopyLink"
                colorScheme={'blue'}
                onClick={copyLink}
                leftIcon={<CopyIcon />}
                minWidth={'340px'}
                px={5}
                size={{ base: 'sm', md: 'md' }}
              >
                Copier le lien de demande de réservation
              </Button>
            </Box>
          </Box>
        </Box>
        {pipe(
          account,
          O.map(a => a.login),
          O.map(login => (
            <Box backgroundColor={'blue.100'} p={5} key="0">
              Vous êtes connecté comme {login}.
            </Box>
          )),
          O.getOrNull
        )}
        {isIntermittent ?
          (
            <Box
              py={'10px'}
              px={'25px'}
              backgroundColor={'#C6F6D5'}
              borderLeft={'4px'}
              borderColor={'#38A169'}
              minW={{ base: '380px', md: '650px' }}
            >
              <Stack justifyContent={'space-between'} direction={{ base: 'column', md: 'row' }}>
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
                  size={{ base: 'sm', md: 'md' }}
                >
                  Créer une réservation
                </Button>
              </Stack>
            </Box>
          ) :
          ''}
        {isRespHebergement ?
          (
            <Box
              py={'10px'}
              px={'25px'}
              backgroundColor={'#C6F6D5'}
              borderLeft={'4px'}
              borderColor={'#38A169'}
              minW={{ base: '380px', md: '650px' }}
            >
              <Stack justifyContent={'space-between'} direction={{ base: 'column', md: 'row' }}>
                <VStack alignItems={'flex-start'}>
                  <HStack>
                    <BsPlusCircleFill color="#38A169" size={'24px'} />
                    <Text fontWeight={'bold'}>Nouvelle réservation pour un client</Text>
                  </HStack>
                </VStack>
                <Button
                  as={Link}
                  to={reservationCreationCustomerUrl}
                  colorScheme={'green'}
                  _hover={{
                    textDecoration: 'none',
                    color: 'white',
                    backgroundColor: '#38A169'
                  }}
                  size={{ base: 'sm', md: 'md' }}
                >
                  Créer une réservation
                </Button>
              </Stack>
            </Box>
          ) :
          ''}
        {isRespHebergement ?
          (
            <>
              <Box
                py={'10px'}
                px={'25px'}
                backgroundColor={'#C6F6D5'}
                borderLeft={'4px'}
                borderColor={'#38A169'}
                minW={{ base: '380px', md: '650px' }}
              >
                <Stack justifyContent={'space-between'} direction={{ base: 'column', md: 'row' }}>
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
                    size={{ base: 'sm', md: 'md' }}
                  >
                    Créer une réservation
                  </Button>
                </Stack>
              </Box>
              <Box
                py={'10px'}
                px={'25px'}
                backgroundColor={'#C6F6D5'}
                borderLeft={'4px'}
                borderColor={'#38A169'}
                minW={{ base: '380px', md: '650px' }}
              >
                <Stack justifyContent={'space-between'} direction={{ base: 'column', md: 'row' }}>
                  <VStack alignItems={'flex-start'}>
                    <HStack>
                      <BsPlusCircleFill color="#38A169" size={'24px'} />
                      <Text fontWeight={'bold'}>Nouvelle réservation pour un salarié</Text>
                    </HStack>
                  </VStack>
                  <Button
                    as={Link}
                    to={reservationCreationEmployeeUrl}
                    colorScheme={'green'}
                    _hover={{
                      textDecoration: 'none',
                      color: 'white',
                      backgroundColor: '#38A169'
                    }}
                    size={{ base: 'sm', md: 'md' }}
                  >
                    Créer une réservation
                  </Button>
                </Stack>
              </Box>
            </>
          ) :
          ''}
        {
          /* {isHabitant ?
          (
            <Box
              py={'10px'}
              px={'25px'}
              backgroundColor={'#C6F6D5'}
              borderLeft={'4px'}
              borderColor={'#38A169'}
              minW={{ base: '400px', md: '650px' }}
            >
              <Stack
                justifyContent={'space-between'}
                direction={{ base: 'column', md: 'row' }}
                // minW={screen.availWidth > 300 ? '500px' : '300px'}
                // width={screen.availWidth > 300 ? 'auto' : '400px'}
              >
                <VStack alignItems={'flex-start'}>
                  <HStack>
                    <BsPlusCircleFill color="#38A169" size={'24px'} />
                    <Text fontWeight={'bold'}>Nouvelle réservation pour un invité</Text>
                  </HStack>
                </VStack>
                <Button
                  as={Link}
                  // width={'auto'}
                  width={screen.availWidth > 300 ? 'auto' : '100%'}
                  to={reservationCreationInviteUrl}
                  colorScheme={'green'}
                  _hover={{
                    textDecoration: 'none',
                    color: 'white',
                    backgroundColor: '#38A169'
                  }}
                >
                  Créer une réservation
                </Button>
              </Stack>
            </Box>
          ) :
          ''} */
        }

        {isRespHebergement ? <ReservationsToBeProcessedButton /> : ''}
        {isAdmin ? <RGPDAnonymizeData /> : ''}
      </VStack>
    </HStack>
  )
}
