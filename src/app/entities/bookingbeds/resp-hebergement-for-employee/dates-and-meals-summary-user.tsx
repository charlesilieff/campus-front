import { CheckCircleIcon } from '@chakra-ui/icons'
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

import type { MealsOnlyReservationDatesAndMeals } from '../models/OneBedReservationDatesAndMeals'

interface DatesAndMealsSummaryProps {
  datesAndMeals: MealsOnlyReservationDatesAndMeals
  setUpdate: (update: boolean) => void
}

export const DatesAndMealsSummary = (
  {
    datesAndMeals: {
      arrivalDate,
      comment,
      departureDate,
      weekMeals,
      isSpecialDiet,
      commentMeals
    },
    setUpdate
  }: DatesAndMealsSummaryProps
): JSX.Element => {
  const mealSelected = (
    { isBreakfast, isDinner, isLunch }: {
      isBreakfast: boolean
      isDinner: boolean
      isLunch: boolean
    }
  ): string => {
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
        Dates et repas <CheckCircleIcon color={'green'}></CheckCircleIcon>
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
          <Text fontWeight={'bold'}>{'Lundi : '}</Text>
          <Text>{mealSelected(weekMeals.monday)}</Text>
        </HStack>
        <HStack>
          <Text fontWeight={'bold'}>{'Mardi : '}</Text>
          <Text>{mealSelected(weekMeals.tuesday)}</Text>
        </HStack>
        <HStack>
          <Text fontWeight={'bold'}>{'Mercredi : '}</Text>
          <Text>{mealSelected(weekMeals.wednesday)}</Text>
        </HStack>
        <HStack>
          <Text fontWeight={'bold'}>{'Jeudi : '}</Text>
          <Text>{mealSelected(weekMeals.thursday)}</Text>
        </HStack>
        <HStack>
          <Text fontWeight={'bold'}>{'Vendredi : '}</Text>
          <Text>{mealSelected(weekMeals.friday)}</Text>
        </HStack>
        <HStack>
          <Text fontWeight={'bold'}>{'Samedi : '}</Text>
          <Text>{mealSelected(weekMeals.saturday)}</Text>
        </HStack>
        <HStack>
          <Text fontWeight={'bold'}>{'Dimanche : '}</Text>
          <Text>{mealSelected(weekMeals.sunday)}</Text>
        </HStack>
      </VStack>
      <HStack py={2}>
        <Text fontWeight={'bold'}>Régime sans lactose/gluten ?</Text>
        <Text>{isSpecialDiet === 'true' ? 'Oui' : 'Non'}</Text>
      </HStack>
      <VStack alignItems={'flex-start'} py={2}>
        <Text fontWeight={'bold'}>Votre commentaire à propos de la réservation :</Text>
        <Text>{comment}</Text>
      </VStack>
      <VStack alignItems={'flex-start'} py={2}>
        <Text fontWeight={'bold'}>
          Votre commentaire à propos des repas (ex : allergie, régime, vegan...) :
        </Text>
        <Text>{commentMeals}</Text>
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
