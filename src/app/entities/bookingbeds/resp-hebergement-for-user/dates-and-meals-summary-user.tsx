import {
  Button,
  Heading,
  HStack,
  Text,
  VStack
} from '@chakra-ui/react'
import * as O from '@effect/data/Option'
import React from 'react'
import { BsPencil } from 'react-icons/bs'

import type { DatesAndMeals } from './reservation-update'

interface DatesAndMealsSummaryProps {
  datesAndMeals: DatesAndMeals
  setUpdate: (update: boolean) => void

  setBedId: (bedId: O.Option<number>) => void
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
      specialDiet,
      isArrivalBreakfast,
      isDepartureBreakfast
    },
    setUpdate,
    // setSelectedBeds
    setBedId
  }: DatesAndMealsSummaryProps
): JSX.Element => {
  const mealSelected = (isBreakfast: boolean, isDinner: boolean, isLunch: boolean): string => {
    if (isBreakfast && isDinner && isLunch) {
      return 'petit déjeuner, déjeuner et dîner'
    } else if (isBreakfast && isLunch) {
      return 'petit déjeuner et déjeuner'
    } else if (isLunch && isDinner) {
      return 'déjeuner et dîner'
    } else if (isBreakfast && isDinner) {
      return 'petit déjeuner et dîner'
    } else if (isBreakfast) {
      return 'petit déjeuner'
    } else if (isLunch) {
      return 'déjeuner'
    } else if (isDinner) {
      return 'dîner'
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
      <Heading size={'lg'} marginBottom={8}>
        Dates et repas
      </Heading>

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
        <Text fontWeight={'bold'}>Régime sans lactose/gluten ?</Text>
        <Text>{specialDiet === 'true' ? 'Oui' : 'Non'}</Text>
      </HStack>
      <VStack alignItems={'flex-start'} py={2}>
        <Text fontWeight={'bold'}>Commentaire :</Text>
        <Text>{comment}</Text>
      </VStack>
      <Button
        colorScheme="blue"
        rightIcon={<BsPencil />}
        onClick={() => {
          setBedId(O.none())
          setUpdate(true)
        }}
      >
        Modifier
      </Button>
    </VStack>
  )
}
