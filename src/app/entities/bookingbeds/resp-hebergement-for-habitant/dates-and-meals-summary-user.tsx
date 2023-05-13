import {
  Button,
  Heading,
  HStack,
  Stack,
  Text,
  VStack
} from '@chakra-ui/react'
import React from 'react'
import { BsPencil } from 'react-icons/bs'

import type { DatesAndMeals } from './reservation-update'

interface DatesAndMealsSummaryProps {
  datesAndMeals: DatesAndMeals
  setUpdate: (update: boolean) => void
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
    setUpdate
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
      borderColor={'green'}
    >
      <Heading size={'lg'} marginBottom={4}>
        Dates et repas
      </Heading>

      <Stack py={2} direction={{ base: 'column', md: 'row' }}>
        <Text fontWeight={'bold'}>{"Date d'arrivée :"}</Text>
        <Text>{new Date(arrivalDate).toLocaleDateString('fr')}</Text>
        <Text pl={{ base: '0', sm: '12' }} fontWeight={'bold'}>{'Date de départ :'}</Text>
        <Text>{new Date(departureDate).toLocaleDateString('fr')}</Text>
      </Stack>
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
          setUpdate(true)
        }}
      >
        Modifier
      </Button>
    </VStack>
  )
}