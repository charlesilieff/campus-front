import { CheckCircleIcon } from '@chakra-ui/icons'
import {
  Button,
  Heading,
  HStack,
  Text,
  VStack
} from '@chakra-ui/react'
import React from 'react'
import { BsPencil } from 'react-icons/bs'
import { MdPending } from 'react-icons/md'

import type { Reservation } from './reservation-update'

interface ReservationSummaryProps {
  datesAndMeals: Reservation
  setUpdate: (update: boolean) => void
  isReservationSaved: boolean
}

export const DatesAndMealsSummary = (
  {
    datesAndMeals: {
      arrivalDate,
      comment,
      departureDate,
      isArrivalDinner,
      isArrivalLunch,
      isDepartureDinner,
      isDepartureLunch,
      specialDietNumber,
      personNumber,
      isArrivalBreakfast,
      isDepartureBreakfast
    },
    setUpdate,
    isReservationSaved
  }: ReservationSummaryProps
): JSX.Element => {
  const mealSelected = (isDinner: boolean, isLunch: boolean): string => {
    if (isDinner && isLunch) {
      return 'déjeuner et dîner'
    } else if (isDinner) {
      return 'dîner'
    } else if (isLunch) {
      return 'déjeuner'
    } else {
      return 'aucun'
    }
  }

  return (
    <VStack
      alignItems={'flex-start'}
      w={'100%'}
      border={'solid'}
      p={4}
      borderRadius={8}
      borderColor={'#D9D9D9'}
    >
      <HStack marginBottom={8}>
        <Heading size={'lg'}>
          Votre demande de réservation
        </Heading>
        {isReservationSaved ?
          <CheckCircleIcon boxSize={'30px'} color={'green'} /> :
          <MdPending color="#e74c3c" size={'30px'} />}
      </HStack>

      <HStack py={2}>
        <Text fontWeight={'bold'}>{"Date d'arrivée :"}</Text>
        <Text>{new Date(arrivalDate).toLocaleDateString('fr')}</Text>
        <Text pl={12} fontWeight={'bold'}>{'Date de départ :'}</Text>
        <Text>{new Date(departureDate).toLocaleDateString('fr')}</Text>
      </HStack>
      <VStack alignItems={'flex-start'} py={2}>
        <Text fontWeight={'bold'}>Repas sélectionnés :</Text>
        <HStack>
          <Text fontWeight={'bold'}>{"Jour d'arrivée :"}</Text>
          <Text>{mealSelected(isArrivalBreakfast, isArrivalDinner, isArrivalLunch)}</Text>
        </HStack>
        <HStack>
          <Text fontWeight={'bold'}>{'Jour de départ :'}</Text>
          <Text>
            {mealSelected(isDepartureBreakfast, isDepartureDinner, isDepartureLunch)}
          </Text>
        </HStack>
      </VStack>
      <HStack py={2}>
        <Text fontWeight={'bold'}>Nombre de personnes :</Text>
        <Text>{personNumber}</Text>
      </HStack>
      <HStack py={2}>
        <Text fontWeight={'bold'}>Régimes sans lactose/gluten :</Text>
        <Text>{specialDietNumber}</Text>
      </HStack>
      <VStack alignItems={'flex-start'} py={2}>
        <Text fontWeight={'bold'}>Commentaire :</Text>
        <Text>{comment}</Text>
      </VStack>
      <Button
        colorScheme="blue"
        rightIcon={<BsPencil />}
        onClick={() => {
          setUpdate(true)
        }}
      >
        Modifier
      </Button>
    </VStack>
  )
}
