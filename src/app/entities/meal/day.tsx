import {
  Box,
  Checkbox,
  Grid,
  Text
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
  mealsContext: IMeal[]
}

export const Day = ({ positionX, date, index, mealsContext }: IProps) => {
  const handleChangeRegularLunch = () => {
    console.log('The checkbox was toggled ', date.format('YYYY-MM-DD'), positionX, index)
    console.log('The checkbox was toggled ', mealsContext[index].regularLunch)
    if (mealsContext[index].regularLunch === 0) {
      mealsContext[index].regularLunch = 1
    } else {
      mealsContext[index].regularLunch = 0
    }
  }
  const handleChangeSpecialLunch = () => {
    if (mealsContext[index].specialLunch === 0) {
      mealsContext[index].specialLunch = 1
    } else {
      mealsContext[index].specialLunch = 0
    }
  }
  const handleChangeRegularDiner = () => {
    console.log('The checkbox was toggled ', date.format('YYYY-MM-DD'), positionX, index)
    console.log('The checkbox was toggled ', mealsContext[index].regularDinner)
    if (mealsContext[index].regularDinner === 0) {
      mealsContext[index].regularDinner = 1
    } else {
      mealsContext[index].regularDinner = 0
    }
  }
  const handleChangeSpecialDiner = () => {
    if (mealsContext[index].specialDinner === 0) {
      mealsContext[index].specialDinner = 1
    } else {
      mealsContext[index].specialDinner = 0
    }
  }
  const handleChangeBreakfast = () => {
    if (mealsContext[index].breakfast === 0) {
      mealsContext[index].breakfast = 1
    } else {
      mealsContext[index].breakfast = 0
    }
  }

  const dayWeek = date.day()
  const dayMonth = date.date()

  const defaultValue: IMealsNumber = {
    id: mealsContext[index]?.id,
    breakfast: 0,
    lunchtime: { specialDiet: 0, classicDiet: 0 },
    dinner: { specialDiet: 0, classicDiet: 0 },
    comment: ''
  }

  const [mealsNumber, setMealsNumber] = useState(defaultValue)

  // const [mealsNumberReferential, setMealsNumberReferential] = useState(defaultValue)

  let style: React.CSSProperties
  style = commentStyle(positionX, date, mealsContext, index)
  useEffect(() => {
    style = commentStyle(positionX, date, mealsContext, index)
  }, [mealsContext])

  useEffect(() => {
    const mealsToCookFromDb: IMealsNumber = {
      id: mealsContext[index]?.id,
      breakfast: mealsContext[index]?.breakfast,
      lunchtime: {
        specialDiet: mealsContext[index]?.specialLunch,
        classicDiet: mealsContext[index]?.regularLunch
      },
      dinner: {
        specialDiet: mealsContext[index]?.specialDinner,
        classicDiet: mealsContext[index]?.regularDinner
      },
      comment: mealsContext[index]?.comment
    }

    setMealsNumber(mealsToCookFromDb)
  }, [mealsContext])

  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(!modal)
  }

  // const testRegular = countRegular(mealsContext)
  // const testSpecial = countSpecial(mealsContext)

  return (
    <>
      {
        /* <Box>
      <Grid
        className="grid-container"
        borderColor={'#D9D9D9'}
        overflowX={'scroll'}
        overflowY={'hidden'}
      > */
      }
      <div className="day popup-comment" style={style} onClick={() => toggle()}>
        {date.format('ddd DD ')}
      </div>

      {
        /* <div>
        {mealsNumber?.comment === 'test list 31 days' ? '' : mealsNumber?.lunchtime.classicDiet}

      </div> */
      }
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
          {/* {mealsNumber?.breakfast === 1} */}
          {mealsNumber?.id !== undefined && mealsNumber?.breakfast === 1 ?
            (
              <Checkbox
                onChange={handleChangeBreakfast}
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
          {/* {mealsNumber?.lunchtime.classicDiet === 1} */}
          {mealsNumber?.id !== undefined ?
            (
              <Checkbox
                onChange={handleChangeRegularLunch}
                isChecked={mealsNumber?.lunchtime.classicDiet === 1}
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
          {mealsNumber?.id !== undefined && mealsNumber?.lunchtime.specialDiet === 1 ?
            (
              <Checkbox
                onChange={handleChangeSpecialLunch}
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
          {mealsNumber?.id !== undefined && mealsNumber?.dinner.classicDiet === 1 ?
            (
              <Checkbox
                onChange={handleChangeRegularDiner}
                isChecked={mealsNumber?.dinner.classicDiet === 1}
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
          {mealsNumber?.id !== undefined && mealsNumber?.dinner.specialDiet === 1 ?
            (
              <Checkbox
                onChange={handleChangeSpecialDiner}
                isChecked={mealsNumber?.dinner.specialDiet === 1}
              />
            ) :
            null}
          {/* {mealsNumber?.dinner.specialDiet} */}
        </div>
      </div>
      {
        /* </Grid>
    </Box> */
      }
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

// function countRegular(mealsData: IMeal[]) {
//   const regular = mealsData.map(meals => meals.regularDinner + meals.regularLunch)
//   const sumRegular = regular.reduce((a, b) => a + b, 0)
//   return sumRegular
// }

// function countSpecial(mealsData: IMeal[]) {
//   const special = mealsData.map(meals => meals.specialLunch + meals.specialDinner)
//   const sumSpecial = special.reduce((a, b) => a + b, 0)
//   return sumSpecial
// }
