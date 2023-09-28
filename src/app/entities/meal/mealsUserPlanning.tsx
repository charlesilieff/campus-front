import { MoonIcon, SunIcon, TimeIcon } from '@chakra-ui/icons'
import { Box, Checkbox, Grid, Text, VStack } from '@chakra-ui/react'
import type { IMeal } from 'app/shared/model/meal.model'
import { getDateKey } from 'app/shared/util/date-utils'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import React from 'react'
import { FaUtensils } from 'react-icons/fa'

import { Day } from './day'
import { Months } from './months'
import { periodCheckChecked } from './utils'

interface IProps {
  date: Dayjs
  totalDays: number
  numberOfDays: number
  mealsData: IMeal[]
  setMealsData: (mealsData: IMeal[]) => void
  isSpecialDiet: boolean
}

/**
 * Affiche un tableau (colonne : les jours (calendrier)).
 * Chaque jour (Day) comporte les informations suivantes :
 *  - Repas de midi :
 *        - régime spécial
 *        - régime classique
 *  - Repas du soir.
 */
export const MealsUserPlanning = (
  { date, totalDays, numberOfDays, mealsData, setMealsData, isSpecialDiet }: IProps
) => {
  // On souhaite afficher 31 jours => Tableau de 31 élements.
  const monthDays = Array.from({ length: numberOfDays })

  // Objets contenant la position en x dans la grille des jours.
  const positionX = {}
  const positionX7Day = 3

  const periodCheckDisabled = date.add(numberOfDays, 'days').isBefore(dayjs().add(2, 'day'))
    || mealsData.every(m => m.id === undefined)

  const breakfastChecked = periodCheckChecked('breakfast', mealsData)

  const dinnerChecked = periodCheckChecked('dinner', mealsData)

  const lunchChecked = periodCheckChecked('lunch', mealsData)
  const now = dayjs()

  const handleAllMealChange = (allMealChecked: boolean, mealsData: IMeal[], now: Dayjs): IMeal[] =>
    // @ts-expect-error : TODO : corriger le type de mealsData
    mealsData.map(m => ({
      ...m,
      breakfast: dayjs(m.date).isBefore(now.add(1, 'day')) ? m.breakfast : allMealChecked ? 0 : 1,
      regularLunch: dayjs(m.date).isBefore(now.add(1, 'day')) ?
        m.regularLunch :
        isSpecialDiet ?
        0 :
        allMealChecked ?
        0 :
        1,
      specialLunch: dayjs(m.date).isBefore(now.add(1, 'day')) ?
        m.specialLunch :
        !isSpecialDiet ?
        0 :
        allMealChecked ?
        0 :
        1,
      regularDinner: dayjs(m.date).isBefore(now.add(1, 'day')) ?
        m.regularDinner :
        isSpecialDiet ?
        0 :
        allMealChecked ?
        0 :
        1,
      specialDinner: dayjs(m.date).isBefore(now.add(1, 'day')) ?
        m.specialDinner :
        !isSpecialDiet ?
        0 :
        allMealChecked ?
        0 :
        1
    }))

  const handleBreakfastChange = (
    breakfastChecked: boolean,
    mealsData: IMeal[],
    now: Dayjs
  ): IMeal[] =>
    // @ts-expect-error : TODO : corriger le type de mealsData
    mealsData.map(m => ({
      ...m,
      breakfast: dayjs(m.date).isBefore(now.add(1, 'day')) ? m.breakfast : breakfastChecked ? 0 : 1
    }))

  const handleLunchChange = (lunchChecked: boolean, mealsData: IMeal[], now: Dayjs): IMeal[] =>
    // @ts-expect-error : TODO : corriger le type de mealsData
    mealsData.map(m => ({
      ...m,
      regularLunch: dayjs(m.date).isBefore(now.add(1, 'day')) ?
        m.regularLunch :
        isSpecialDiet ?
        0 :
        lunchChecked ?
        0 :
        1,
      specialLunch: dayjs(m.date).isBefore(now.add(1, 'day')) ?
        m.specialLunch :
        !isSpecialDiet ?
        0 :
        lunchChecked ?
        0 :
        1
    }))

  const handleDinnerChange = (dinnerChecked: boolean, mealsData: IMeal[], now: Dayjs): IMeal[] =>
    // @ts-expect-error : TODO : corriger le type de mealsData
    mealsData.map(m => ({
      ...m,
      regularDinner: dayjs(m.date).isBefore(now.add(1, 'day')) ?
        m.regularDinner :
        isSpecialDiet ?
        0 :
        dinnerChecked ?
        0 :
        1,
      specialDinner: dayjs(m.date).isBefore(now.add(1, 'day')) ?
        m.specialDinner :
        !isSpecialDiet ?
        0 :
        dinnerChecked ?
        0 :
        1
    }))

  return (
    <Grid
      className="grid-container"
      overflowX={'auto'}
    >
      <Text
        gridRowStart={1}
        gridRowEnd={4}
        gridColumnStart={1}
        gridColumnEnd={1}
        borderRightStyle={'solid'}
        borderRightWidth={'0.05em'}
        borderColor={'#D9D9D9'}
        borderBottom={0}
        borderLeft={0}
        justifyContent={'center'}
        display={'flex'}
        alignItems={'center'}
      >
        <VStack justifyContent={'center'}>
          <Box paddingRight={2}>Repas</Box>

          <FaUtensils />
        </VStack>
      </Text>
      <Text
        gridRowStart={1}
        gridRowEnd={4}
        gridColumnStart={2}
        gridColumnEnd={3}
        borderRightStyle={'none'}
        borderBottom={0}
        borderLeft={0}
        justifyContent={'center'}
        display={'flex'}
        px={1}
      >
        <VStack spacing={0} justifyContent={'center'}>
          <Box>Période</Box>
          <Checkbox
            size="lg"
            mx={'auto'}
            p={2}
            colorScheme={'orange'}
            isChecked={breakfastChecked && dinnerChecked && lunchChecked}
            onChange={_ =>
              setMealsData(
                handleAllMealChange(
                  breakfastChecked && dinnerChecked && lunchChecked,
                  mealsData,
                  now
                )
              )}
          />
        </VStack>
      </Text>
      <Text
        gridRowStart={4}
        gridRowEnd={5}
        gridColumnStart={1}
        gridColumnEnd={2}
        textAlign={'center'}
        overflowWrap={'break-word'}
        borderTopStyle={'solid'}
        borderRightStyle={'solid'}
        borderTopWidth={'0.15em'}
        borderRightWidth={'0.05em'}
        borderColor={'#D9D9D9'}
        borderBottom={0}
        borderLeft={0}
        p={2}
        backgroundColor={'yellow.50'}
      >
        <VStack justifyContent={'center'}>
          <Box paddingRight={2}>Matin</Box>
          <TimeIcon />
        </VStack>
      </Text>
      <Text
        gridRowStart={4}
        gridRowEnd={5}
        gridColumnStart={2}
        gridColumnEnd={3}
        textAlign={'center'}
        overflowWrap={'break-word'}
        borderTopStyle={'solid'}
        borderRightStyle={'none'}
        borderWidth={'0.15em'}
        borderColor={'#D9D9D9'}
        borderBottom={0}
        borderLeft={0}
        p={2}
        backgroundColor={'yellow.50'}
      >
        <Checkbox
          size="lg"
          mx={'auto'}
          p={2}
          colorScheme={'orange'}
          onChange={_ => setMealsData(handleBreakfastChange(breakfastChecked, mealsData, now))}
          isChecked={breakfastChecked}
          isDisabled={periodCheckDisabled}
        />
      </Text>
      <Text
        gridRowStart={5}
        gridRowEnd={6}
        gridColumnStart={1}
        gridColumnEnd={2}
        textAlign={'center'}
        borderTopStyle={'solid'}
        borderRightStyle={'solid'}
        borderWidth={'0.05em'}
        borderColor={'#D9D9D9'}
        borderBottom={0}
        borderLeft={0}
        backgroundColor={'orange.100'}
        p={2}
      >
        <VStack justifyContent={'center'}>
          <Box paddingRight={2}>Midi</Box>
          <SunIcon />
        </VStack>
      </Text>
      <Box
        gridRowStart={5}
        gridRowEnd={6}
        gridColumnStart={2}
        gridColumnEnd={3}
        textAlign={'center'}
        overflowWrap={'break-word'}
        borderTopStyle={'solid'}
        borderRightStyle={'none'}
        borderWidth={'0.05em'}
        borderColor={'#D9D9D9'}
        borderBottom={0}
        borderLeft={0}
        backgroundColor={'orange.100'}
      >
        <Checkbox
          size="lg"
          mx={'auto'}
          p={2}
          colorScheme={'orange'}
          onChange={_ => setMealsData(handleLunchChange(lunchChecked, mealsData, now))}
          isChecked={lunchChecked}
          isDisabled={periodCheckDisabled}
        />
      </Box>

      <Text
        gridRowStart={6}
        gridRowEnd={7}
        gridColumnStart={1}
        gridColumnEnd={2}
        textAlign={'center'}
        overflowWrap={'break-word'}
        borderTopStyle={'solid'}
        borderRightStyle={'solid'}
        borderWidth={'0.05em'}
        borderColor={'#D9D9D9'}
        borderBottom={0}
        borderLeft={0}
        p={2}
        backgroundColor={'#F7F7F7'}
      >
        <VStack>
          <Box paddingRight={2}>Soir</Box>
          <MoonIcon />
        </VStack>
      </Text>
      <Box
        gridRowStart={6}
        gridRowEnd={7}
        gridColumnStart={2}
        gridColumnEnd={3}
        textAlign={'center'}
        overflowWrap={'break-word'}
        borderTopStyle={'solid'}
        borderRightStyle={'none'}
        borderWidth={'0.05em'}
        borderColor={'#D9D9D9'}
        borderBottom={0}
        borderLeft={0}
        p={2}
        backgroundColor={'#F7F7F7'}
      >
        <Checkbox
          size="lg"
          mx={'auto'}
          p={2}
          colorScheme={'orange'}
          onChange={_ => setMealsData(handleDinnerChange(dinnerChecked, mealsData, now))}
          isChecked={dinnerChecked}
          isDisabled={periodCheckDisabled}
        />
      </Box>
      <Months date={date} month={0} totalDays={totalDays} numberOfDays={numberOfDays}></Months>
      {date.date() + numberOfDays - 1 > totalDays && (
        <Months date={date} month={1} totalDays={totalDays} numberOfDays={numberOfDays}></Months>
      )}

      {monthDays.map((_, index) => {
        const gridColumnStart = positionX7Day + index
        // On construit l'objet qui va permettre de récupérer la bonne position en X pour afficher les réservations.
        const dateDay = date.add(index, 'day')
        const dateKey = getDateKey(dateDay)
        positionX[dateKey] = gridColumnStart
        return (
          <Day
            positionX={gridColumnStart}
            key={dateKey}
            date={dateDay}
            index={index}
            mealsData={mealsData}
            setMealsData={setMealsData}
          />
        )
      })}
    </Grid>
  )
}
