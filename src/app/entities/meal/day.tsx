import {
  Checkbox
} from '@chakra-ui/react'
import type { IMeal } from 'app/shared/model/meal.model'
import type { Dayjs } from 'dayjs'
import type dayjs from 'dayjs'
import React, { useContext, useEffect, useState } from 'react'

import type { IMealsNumber } from './IMealsNumber'
import { MealsContext } from './mealsContext'

interface IProps {
  positionX: number
  date: Dayjs
  index: number
}

export const Day = ({ positionX, date, index }: IProps) => {
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
    breakfast: 0,
    lunchtime: { specialDiet: 0, classicDiet: 0 },
    dinner: { specialDiet: 0, classicDiet: 0 },
    comment: ''
  }

  const [mealsContext] = useContext(MealsContext)

  const [mealsNumber, setMealsNumber] = useState(defaultValue)

  const [mealsNumberReferential, setMealsNumberReferential] = useState(defaultValue)

  let style: React.CSSProperties
  style = commentStyle(positionX, date, mealsContext, index)
  useEffect(() => {
    style = commentStyle(positionX, date, mealsContext, index)
  }, [mealsContext])

  useEffect(() => {
    const mealsToCookFromDb: IMealsNumber = {
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

    const mealsReferentialFromDb: IMealsNumber = {
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
    setMealsNumberReferential(mealsReferentialFromDb)

    const theNewMealsNumber = {
      breakfast: mealsToCookFromDb.breakfast - mealsReferentialFromDb.breakfast === 0 ?
        mealsReferentialFromDb.breakfast :
        mealsToCookFromDb.breakfast,
      lunchtime: {
        specialDiet:
          mealsToCookFromDb.lunchtime.specialDiet - mealsReferentialFromDb.lunchtime.specialDiet
              === 0 ?
            mealsReferentialFromDb.lunchtime.specialDiet :
            mealsToCookFromDb.lunchtime.specialDiet,

        classicDiet:
          mealsToCookFromDb.lunchtime.classicDiet - mealsReferentialFromDb.lunchtime.classicDiet
              === 0 ?
            mealsReferentialFromDb.lunchtime.classicDiet :
            mealsToCookFromDb.lunchtime.classicDiet
      },
      dinner: {
        specialDiet:
          mealsToCookFromDb.dinner.specialDiet - mealsReferentialFromDb.dinner.specialDiet === 0 ?
            mealsReferentialFromDb.dinner.specialDiet :
            mealsToCookFromDb.dinner.specialDiet,

        classicDiet:
          mealsToCookFromDb.dinner.classicDiet - mealsReferentialFromDb.dinner.classicDiet === 0 ?
            mealsReferentialFromDb.dinner.classicDiet :
            mealsToCookFromDb.dinner.classicDiet
      },
      comment: mealsContext[index]?.comment
    }

    setMealsNumber(theNewMealsNumber)
  }, [mealsContext])

  const colorNumber = (
    time: 'lunchtime' | 'dinner' | 'breakfast',
    diet: 'specialDiet' | 'classicDiet'
  ) => {
    let color: string
    let referentialColor: number
    let numberToColor: number

    if (time === 'lunchtime') {
      if (diet === 'specialDiet') {
        referentialColor = mealsNumberReferential?.lunchtime.specialDiet
        numberToColor = mealsNumber?.lunchtime.specialDiet
      }
      if (diet === 'classicDiet') {
        referentialColor = mealsNumberReferential?.lunchtime.classicDiet
        numberToColor = mealsNumber?.lunchtime.classicDiet
      }
    }
    if (time === 'dinner') {
      if (diet === 'specialDiet') {
        referentialColor = mealsNumberReferential?.dinner.specialDiet
        numberToColor = mealsNumber?.dinner.specialDiet
      }
      if (diet === 'classicDiet') {
        referentialColor = mealsNumberReferential?.dinner.classicDiet
        numberToColor = mealsNumber?.dinner.classicDiet
      }
    }
    if (time === 'breakfast') {
      referentialColor = mealsNumberReferential?.breakfast
      numberToColor = mealsNumber?.breakfast
    }

    if (numberToColor > referentialColor) {
      color = 'green'
    }
    if (numberToColor < referentialColor) {
      color = 'red'
    }
    if (numberToColor === referentialColor) {
      color = 'black'
    }
    return color
  }

  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(!modal)
  }

  return (
    <>
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
            color: colorNumber('lunchtime', 'classicDiet')
          } as React.CSSProperties}
        >
          {mealsNumber?.lunchtime.classicDiet === 1}
          {mealsNumber?.lunchtime.classicDiet === 1
              && mealsNumber?.comment !== 'test list 31 days' ?
            <Checkbox onChange={handleChangeRegularLunch} defaultChecked></Checkbox> :
            mealsNumber?.lunchtime.classicDiet === 0 ?
            <Checkbox onChange={handleChangeRegularLunch}></Checkbox> :
            ''}
          {
            /* {mealsNumber?.comment !== 'test list 31 days'
              && mealsNumber?.lunchtime.classicDiet === 1 ?
            <Checkbox defaultChecked></Checkbox> :
            mealsNumber?.comment !== 'test list 31 days'
              && mealsNumber?.lunchtime.classicDiet === 0 ?
            <Checkbox></Checkbox> :
            ''}*/
          }
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
          borderBottomWidth: '0.1em',
          borderBottomStyle: 'solid',
          borderBottomColor: 'black'
        } as React.CSSProperties}
      >
        <div
          style={{
            color: colorNumber('lunchtime', 'specialDiet')
          } as React.CSSProperties}
        >
          {
            /* {mealsNumber?.lunchtime.specialDiet} */
          }
          {mealsNumber?.lunchtime.specialDiet === 1}
          {mealsNumber?.comment !== 'test list 31 days'
              && mealsNumber?.lunchtime.specialDiet === 1 ?
            <Checkbox onChange={handleChangeSpecialLunch} defaultChecked></Checkbox> :
            mealsNumber?.comment !== 'test list 31 days'
              && mealsNumber?.lunchtime.specialDiet === 0 ?
            <Checkbox onChange={handleChangeSpecialLunch}></Checkbox> :
            ''}
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
          borderBottomWidth: '0.01em',
          borderBottomStyle: 'solid'
        } as React.CSSProperties}
      >
        <div
          style={{
            color: colorNumber('dinner', 'classicDiet')
          } as React.CSSProperties}
        >
          {/* {mealsNumber?.comment === 'test list 31 days' ? '' : mealsNumber?.lunchtime.classicDiet} */}
          {mealsNumber?.dinner.classicDiet === 1}
          {mealsNumber?.comment !== 'test list 31 days' && mealsNumber?.dinner.classicDiet === 1 ?
            <Checkbox onChange={handleChangeRegularDiner} defaultChecked></Checkbox> :
            mealsNumber?.comment !== 'test list 31 days' && mealsNumber?.dinner.classicDiet === 0 ?
            <Checkbox onChange={handleChangeRegularDiner}></Checkbox> :
            ''}
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
          borderTopStyle: 'solid'
        } as React.CSSProperties}
      >
        <div
          style={{
            color: colorNumber('dinner', 'specialDiet')
          } as React.CSSProperties}
        >
          {mealsNumber?.dinner.specialDiet === 1}
          {mealsNumber?.comment !== 'test list 31 days' && mealsNumber?.dinner.specialDiet === 1 ?
            <Checkbox onChange={handleChangeSpecialDiner} defaultChecked></Checkbox> :
            mealsNumber?.comment !== 'test list 31 days' && mealsNumber?.dinner.specialDiet === 0 ?
            <Checkbox onChange={handleChangeSpecialDiner}></Checkbox> :
            ''}
          {/* {mealsNumber?.dinner.specialDiet} */}
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
            color: colorNumber('dinner', 'specialDiet')
          } as React.CSSProperties}
        >
          {mealsNumber?.breakfast === 1}
          {mealsNumber?.comment !== 'test list 31 days' && mealsNumber?.breakfast === 1 ?
            <Checkbox onChange={handleChangeBreakfast} defaultChecked></Checkbox> :
            mealsNumber?.comment !== 'test list 31 days' && mealsNumber?.breakfast === 0 ?
            <Checkbox onChange={handleChangeBreakfast}></Checkbox> :
            ''}
          {
            /* {mealsNumber?.comment !== 'test list 31 days' && mealsNumber?.breakfast === 0 ?
            <Checkbox></Checkbox> :
            ''} */
          }
          {/* {mealsNumber?.comment === 'test list 31 days' ? '' : ''} */}

          {/* <button>{mealsNumber?.breakfast}</button> */}
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
  if (mealsContext[index]?.comment?.length > 0) {
    style.backgroundColor = '#B8D8BA'
  }
  return style
}
