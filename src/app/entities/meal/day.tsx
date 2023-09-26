import {
  Box,
  Checkbox,
  VStack
} from '@chakra-ui/react'
import type { IMeal } from 'app/shared/model/meal.model'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'

import type { IMealsNumber } from './IMealsNumber'

interface IProps {
  positionX: number
  date: Dayjs
  index: number
  mealsData: IMeal[]
}

type MealType = 'specialLunch' | 'regularDinner' | 'specialDinner' | 'breakfast' | 'regularLunch'

// eslint-disable-next-line complexity
export const Day = ({ positionX, date, index, mealsData }: IProps) => {
  const handleChangeMeal = (mealType: MealType) => {
    if (mealsData[index][mealType] === 0) {
      mealsData[index][mealType] = 1
    } else {
      mealsData[index][mealType] = 0
    }
    const mealsToCookFromDb: IMealsNumber = {
      // @ts-expect-error TODO: fix this
      id: mealsData[index]?.id,
      // @ts-expect-error TODO: fix this
      breakfast: mealsData[index].breakfast,
      lunchtime: {
        // @ts-expect-error TODO: fix this
        specialDiet: mealsData[index]?.specialLunch,
        // @ts-expect-error TODO: fix this
        regularDiet: mealsData[index]?.regularLunch
      },
      dinner: {
        // @ts-expect-error TODO: fix this
        specialDiet: mealsData[index]?.specialDinner,
        // @ts-expect-error TODO: fix this
        regularDiet: mealsData[index]?.regularDinner
      },
      // @ts-expect-error TODO: fix this
      comment: mealsData[index]?.comment
    }
    setMealsNumber(mealsToCookFromDb)
  }

  const dayWeek = date.day()
  const dayMonth = date.date()

  const defaultValue: IMealsNumber = {
    // @ts-expect-error TODO: fix this
    id: mealsData[index]?.id,
    breakfast: 0,
    lunchtime: { specialDiet: 0, regularDiet: 0 },
    dinner: { specialDiet: 0, regularDiet: 0 },
    comment: ''
  }
  const [mealsNumber, setMealsNumber] = useState(defaultValue)

  let style: React.CSSProperties
  style = commentStyle(positionX, date)
  useEffect(() => {
    style = commentStyle(positionX, date)
  }, [mealsData])

  useEffect(() => {
    const mealsToCookFromDb: IMealsNumber = {
      // @ts-expect-error TODO: fix this
      id: mealsData[index]?.id,
      // @ts-expect-error TODO: fix this
      breakfast: mealsData[index]?.breakfast,
      lunchtime: {
        // @ts-expect-error TODO: fix this
        specialDiet: mealsData[index]?.specialLunch,
        // @ts-expect-error TODO: fix this
        regularDiet: mealsData[index]?.regularLunch
      },
      dinner: {
        // @ts-expect-error TODO: fix this
        specialDiet: mealsData[index]?.specialDinner,
        // @ts-expect-error TODO: fix this
        regularDiet: mealsData[index]?.regularDinner
      },
      // @ts-expect-error TODO: fix this
      comment: mealsData[index]?.comment
    }

    setMealsNumber(mealsToCookFromDb)
  }, [mealsData])

  const testRegular = countRegular(mealsData)
  const testSpecial = countSpecial(mealsData)

  return (
    <>
      <Box className="day popup-comment" style={style}>
        <VStack spacing={0}>
          <Box>{date.format('ddd')}</Box>
          <Box>{date.format('DD')}</Box>
        </VStack>
      </Box>

      <Box
        display={'flex'}
        flexDirection={'column'}
        backgroundColor={'yellow.50'}
        gridColumnStart={positionX}
        gridColumnEnd={positionX + 1}
        gridRowStart={'4'}
        gridRowEnd={'5'}
        borderLeftWidth={positionX === 3 ?
          '0.3em' :
          dayMonth === 1 ?
          '0.3em' :
          dayWeek === 1 ?
          '0.15em' :
          '0.01em'}
        borderLeftStyle={positionX === 3 ?
          'double' :
          dayMonth === 1 ?
          'double' :
          dayWeek === 1 ?
          'solid' :
          'solid'}
        borderTopStyle={'solid'}
        borderTopWidth={'0.1em'}
        borderBottomWidth={'0.01em'}
        borderBottomStyle={'solid'}
        py={2}
      >
        {mealsNumber?.id !== undefined ?
          (
            <Checkbox
              colorScheme={'orange'}
              onChange={_ => handleChangeMeal('breakfast')}
              isChecked={mealsNumber?.breakfast === 1}
              isDisabled={date.isBefore(dayjs().add(1, 'day'))}
            />
          ) :
          null}
      </Box>
      <Box
        display={'flex'}
        flexDirection={'column'}
        backgroundColor={'orange.100'}
        gridColumnStart={positionX}
        gridColumnEnd={positionX + 1}
        gridRowStart={'5'}
        gridRowEnd={testRegular ? '6' : '5'}
        borderLeftWidth={positionX === 3 ?
          '0.3em' :
          dayMonth === 1 ?
          '0.3em' :
          dayWeek === 1 ?
          '0.15em' :
          '0.01em'}
        borderLeftStyle={positionX === 3 ?
          'double' :
          dayMonth === 1 ?
          'double' :
          dayWeek === 1 ?
          'solid' :
          'solid'}
        borderTopStyle={'solid'}
        // borderTopWidth={'0.1em'}
        borderBottomWidth={'0.01em'}
        borderBottomStyle={'solid'}
        py={2}
        // visibility={mealsNumber?.id !== undefined && testRegular > 1 ? 'visible' : 'hidden'}
      >
        {mealsNumber?.id !== undefined && testRegular > 1
            && mealsNumber?.lunchtime.regularDiet < 2 ?
          (
            <Checkbox
              colorScheme={'orange'}
              onChange={_ => handleChangeMeal('regularLunch')}
              isChecked={mealsNumber?.lunchtime.regularDiet === 1}
              isDisabled={date.isBefore(dayjs().add(1, 'day'))}
            />
          ) :
          null}
      </Box>
      <Box
        display={'flex'}
        flexDirection={'column'}
        backgroundColor={'orange.100'}
        gridColumnStart={positionX}
        gridColumnEnd={positionX + 1}
        gridRowStart={'5'}
        gridRowEnd={!testRegular ? '6' : '5'}
        borderLeftWidth={positionX === 3 ?
          '0.3em' :
          dayMonth === 1 ?
          '0.3em' :
          dayWeek === 1 ?
          '0.15em' :
          '0.01em'}
        borderLeftStyle={positionX === 3 ?
          'double' :
          dayMonth === 1 ?
          'double' :
          dayWeek === 1 ?
          'solid' :
          'solid'}
        borderTopStyle={'solid'}
        // borderTopWidth={'0.1em'}
        borderBottomWidth={'0.01em'}
        borderBottomStyle={'solid'}
        py={2}
        // visibility={mealsNumber?.id !== undefined && testSpecial > 1 ? 'visible' : 'hidden'}
      >
        {mealsNumber?.id !== undefined && testSpecial > 1 ?
          (
            <Checkbox
              colorScheme={'orange'}
              onChange={_ => handleChangeMeal('specialLunch')}
              isChecked={mealsNumber?.lunchtime.specialDiet === 1}
              isDisabled={date.isBefore(dayjs().add(1, 'day'))}
            />
          ) :
          null}
      </Box>

      <Box
        display={'flex'}
        flexDirection={'column'}
        backgroundColor={'#F7F7F7'}
        gridColumnStart={positionX}
        gridColumnEnd={positionX + 1}
        gridRowStart={'6'}
        gridRowEnd={testRegular ? '7' : '6'}
        borderLeftWidth={positionX === 3 ?
          '0.3em' :
          dayMonth === 1 ?
          '0.3em' :
          dayWeek === 1 ?
          '0.15em' :
          '0.01em'}
        borderLeftStyle={positionX === 3 ?
          'double' :
          dayMonth === 1 ?
          'double' :
          dayWeek === 1 ?
          'solid' :
          'solid'}
        borderTopStyle={'solid'}
        // borderTopWidth={'0.1em'}
        borderBottomWidth={'0.01em'}
        borderBottomStyle={'solid'}
        py={2}
        // visibility={mealsNumber?.id !== undefined && testRegular > 1 ? 'visible' : 'hidden'}
      >
        {mealsNumber?.id !== undefined && testRegular > 1 ?
          (
            <Checkbox
              colorScheme={'orange'}
              onChange={_ => handleChangeMeal('regularDinner')}
              isChecked={mealsNumber?.dinner.regularDiet === 1}
              isDisabled={date.isBefore(dayjs().add(1, 'day'))}
            />
          ) :
          null}
      </Box>

      <Box
        display={'flex'}
        flexDirection={'column'}
        backgroundColor={'#F7F7F7'}
        gridColumnStart={positionX}
        gridColumnEnd={positionX + 1}
        gridRowStart={'6'}
        gridRowEnd={testRegular ? '7' : '6'}
        borderLeftWidth={positionX === 3 ?
          '0.3em' :
          dayMonth === 1 ?
          '0.3em' :
          dayWeek === 1 ?
          '0.15em' :
          '0.01em'}
        borderLeftStyle={positionX === 3 ?
          'double' :
          dayMonth === 1 ?
          'double' :
          dayWeek === 1 ?
          'solid' :
          'solid'}
        borderTopStyle={'solid'}
        borderBottomWidth={'0.01em'}
        borderBottomStyle={'solid'}
        py={2}
      >
        {mealsNumber?.id !== undefined && testSpecial > 1 ?
          (
            <Checkbox
              colorScheme={'orange'}
              onChange={_ => handleChangeMeal('specialDinner')}
              isChecked={mealsNumber?.dinner.specialDiet === 1}
              isDisabled={date.isBefore(dayjs().add(1, 'day'))}
            />
          ) :
          null}
      </Box>
    </>
  )
}

/**
 * If comment, the background dolor is green ('#B8D8BA')
 * @param positionX
 * @param date
 * @param mealsContext
 * @param index
 * @returns
 */
function commentStyle(positionX: number, date: dayjs.Dayjs) {
  const style = {
    gridColumnStart: positionX,
    gridColumnEnd: positionX + 1,
    borderLeftWidth: '0.01em',
    borderColor: '#D9D9D9',
    backgroundColor: 'white'
  } as React.CSSProperties
  if (date.day() === 1) {
    style.borderLeftWidth = '0.2em'
  }
  if (positionX === 3 || date.date() === 1) {
    style.borderLeftStyle = 'double'
    style.borderLeftWidth = '0.4em'
    style.borderLeftColor = '#D9D9D9'
  }

  return style
}

function countRegular(mealsData: IMeal[]) {
  // @ts-expect-error TODO: fix this
  const regular = mealsData.map(meals => meals.regularDinner + meals.regularLunch)
  const sumRegular = regular.reduce((a, b) => a + b, 0)
  return sumRegular
}

function countSpecial(mealsData: IMeal[]) {
  // @ts-expect-error TODO: fix this
  const special = mealsData.map(meals => meals.specialLunch + meals.specialDinner)
  const sumSpecial = special.reduce((a, b) => a + b, 0)
  return sumSpecial
}
