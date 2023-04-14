import {
  Box,
  Checkbox
} from '@chakra-ui/react'
import type { IMeal } from 'app/shared/model/meal.model'
import type { Dayjs } from 'dayjs'
import type dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'

import type { IMealsNumber } from './IMealsNumber'

interface IProps {
  positionX: number
  date: Dayjs
  index: number
  mealsData: IMeal[]
}

type MealType = 'specialLunch' | 'regularDinner' | 'specialDinner' | 'breakfast' | 'regularLunch'

export const Day = ({ positionX, date, index, mealsData }: IProps) => {
  const handleChangeMeal = (mealType: MealType) => {
    if (mealsData[index][mealType] === 0) {
      mealsData[index][mealType] = 1
    } else {
      mealsData[index][mealType] = 0
    }
    const mealsToCookFromDb: IMealsNumber = {
      id: mealsData[index]?.id,
      breakfast: mealsData[index].breakfast,
      lunchtime: {
        specialDiet: mealsData[index]?.specialLunch,
        regularDiet: mealsData[index]?.regularLunch
      },
      dinner: {
        specialDiet: mealsData[index]?.specialDinner,
        regularDiet: mealsData[index]?.regularDinner
      },
      comment: mealsData[index]?.comment
    }
    setMealsNumber(mealsToCookFromDb)
  }

  const dayWeek = date.day()
  const dayMonth = date.date()

  const defaultValue: IMealsNumber = {
    id: mealsData[index]?.id,
    breakfast: 0,
    lunchtime: { specialDiet: 0, regularDiet: 0 },
    dinner: { specialDiet: 0, regularDiet: 0 },
    comment: ''
  }
  const [mealsNumber, setMealsNumber] = useState(defaultValue)

  let style: React.CSSProperties
  style = commentStyle(positionX, date, mealsData, index)
  useEffect(() => {
    style = commentStyle(positionX, date, mealsData, index)
  }, [mealsData])

  useEffect(() => {
    const mealsToCookFromDb: IMealsNumber = {
      id: mealsData[index]?.id,
      breakfast: mealsData[index]?.breakfast,
      lunchtime: {
        specialDiet: mealsData[index]?.specialLunch,
        regularDiet: mealsData[index]?.regularLunch
      },
      dinner: {
        specialDiet: mealsData[index]?.specialDinner,
        regularDiet: mealsData[index]?.regularDinner
      },
      comment: mealsData[index]?.comment
    }

    setMealsNumber(mealsToCookFromDb)
  }, [mealsData])

  const testRegular = countRegular(mealsData)
  const testSpecial = countSpecial(mealsData)

  return (
    <>
      <Box className="day popup-comment" style={style}>
        {date.format('ddd DD ')}
      </Box>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gridColumnStart: positionX,
          gridColumnEnd: positionX + 1,
          gridRowStart: 4,
          gridRowEnd: 5,
          borderLeftWidth: dayMonth === 1 ? '0.3em' : dayWeek === 1 ? '0.15em' : '0.01em',
          borderLeftStyle: dayMonth === 1 ? 'double' : dayWeek === 1 ? 'solid' : 'dashed',
          borderTopStyle: 'solid',
          borderBottomWidth: '0.01em',
          borderBottomStyle: 'solid'
        } as React.CSSProperties}
      >
        <div
          style={{
            color: 'orange' // colorNumber('breakfast', 'classicDiet')
          } as React.CSSProperties}
        >
          {mealsNumber?.id !== undefined ?
            (
              <Checkbox
                onChange={_ => handleChangeMeal('breakfast')}
                isChecked={mealsNumber?.breakfast === 1}
              />
            ) :
            null}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gridColumnStart: positionX,
          gridColumnEnd: positionX + 1,
          gridRowStart: 5,
          gridRowEnd: 6,
          borderLeftWidth: dayMonth === 1 ? '0.3em' : dayWeek === 1 ? '0.15em' : '0.01em',
          borderLeftStyle: dayMonth === 1 ? 'double' : dayWeek === 1 ? 'solid' : 'dashed',
          borderTopStyle: 'solid',
          borderBottomWidth: '0.01em',
          borderBottomStyle: 'solid'
        } as React.CSSProperties}
      >
        <div
          style={{
            color: 'orange'
          } as React.CSSProperties}
        >
          {mealsNumber?.lunchtime.regularDiet}
          {mealsNumber?.id !== undefined && testRegular > 1
              && mealsNumber?.lunchtime.regularDiet < 2 ?
            (
              <Checkbox
                onChange={_ => handleChangeMeal('regularLunch')}
                isChecked={mealsNumber?.lunchtime.regularDiet === 1}
              />
            ) :
            null}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gridColumnStart: positionX,
          gridColumnEnd: positionX + 1,
          gridRowStart: 6,
          gridRowEnd: 7,
          borderLeftWidth: dayMonth === 1 ? '0.3em' : dayWeek === 1 ? '0.15em' : '0.01em',
          borderLeftStyle: dayMonth === 1 ? 'double' : dayWeek === 1 ? 'solid' : 'dashed',
          borderTopStyle: 'solid',
          borderBottomWidth: '0.1em',
          borderBottomStyle: 'solid',
          borderBottomColor: 'black'
        } as React.CSSProperties}
      >
        <div
          style={{
            color: 'orange'
          } as React.CSSProperties}
        >
          {mealsNumber?.id !== undefined && testSpecial > 1 ?
            (
              <Checkbox
                onChange={_ => handleChangeMeal('specialLunch')}
                isChecked={mealsNumber?.lunchtime.specialDiet === 1}
              />
            ) :
            null}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gridColumnStart: positionX,
          gridColumnEnd: positionX + 1,
          gridRowStart: 7,
          gridRowEnd: 8,
          borderLeftWidth: dayMonth === 1 ? '0.3em' : dayWeek === 1 ? '0.15em' : '0.01em',
          borderLeftStyle: dayMonth === 1 ? 'double' : dayWeek === 1 ? 'solid' : 'dashed',
          borderTopStyle: 'solid',
          borderBottomWidth: '0.01em',
          borderBottomStyle: 'solid'
        } as React.CSSProperties}
      >
        <div
          style={{
            color: 'orange'
          } as React.CSSProperties}
        >
          {mealsNumber?.id !== undefined && testRegular > 1 ?
            (
              <Checkbox
                onChange={_ => handleChangeMeal('regularDinner')}
                isChecked={mealsNumber?.dinner.regularDiet === 1}
              />
            ) :
            null}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gridColumnStart: positionX,
          gridColumnEnd: positionX + 1,
          gridRowStart: 8,
          gridRowEnd: 9,
          borderLeftWidth: dayMonth === 1 ? '0.3em' : dayWeek === 1 ? '0.15em' : '0.01em',
          borderLeftStyle: dayMonth === 1 ? 'double' : dayWeek === 1 ? 'solid' : 'dashed',
          borderTopStyle: 'solid'
        } as React.CSSProperties}
      >
        <div
          style={{
            color: 'orange'
          } as React.CSSProperties}
        >
          {mealsNumber?.id !== undefined && testSpecial > 1 ?
            (
              <Checkbox
                onChange={_ => handleChangeMeal('specialDinner')}
                isChecked={mealsNumber?.dinner.specialDiet === 1}
              />
            ) :
            null}
        </div>
      </div>
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
function commentStyle(positionX: number, date: dayjs.Dayjs, mealsContext: IMeal[], index: number) {
  const style = {
    gridColumnStart: positionX,
    gridColumnEnd: positionX + 1,
    borderLeftWidth: '0.01em',
    backgroundColor: 'white'
  } as React.CSSProperties
  if (positionX === 8 || date.date() === 1 || date.day() === 1) {
    style.borderLeftWidth = '0.2em'
  }
  if (mealsContext[index]?.id !== undefined) {
    // if (mealsContext[index]?.comment?.length > 0) {
    style.backgroundColor = '#B8D8BA'
  } else style.backgroundColor = '#C4C0BF'
  return style
}

function countRegular(mealsData: IMeal[]) {
  const regular = mealsData.map(meals => meals.regularDinner + meals.regularLunch)
  const sumRegular = regular.reduce((a, b) => a + b, 0)
  return sumRegular
}

function countSpecial(mealsData: IMeal[]) {
  const special = mealsData.map(meals => meals.specialLunch + meals.specialDinner)
  const sumSpecial = special.reduce((a, b) => a + b, 0)
  return sumSpecial
}
