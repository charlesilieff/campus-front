import {
  Button
} from '@chakra-ui/react'
import { useAppDispatch } from 'app/config/store'
import type { IMeal } from 'app/shared/model/meal.model'
import type { IMealWithCustomer } from 'app/shared/model/mealWithCustomer.model'
import axios from 'axios'
import type { Dayjs } from 'dayjs'
import type dayjs from 'dayjs'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import type { IMealsNumber } from './IMealsNumber'
import { MealsContext } from './mealsContext'

interface IProps {
  positionX: number
  date: Dayjs
  index: number
}
const apiUrlMealForOneDay = 'api/meals/forOneDay'

export const Day = ({ positionX, date, index }: IProps) => {
  const [mealsWithCustomerData, setMealsWithCustomerData] = useState([] as IMealWithCustomer[])
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

  // const dispatch = useAppDispatch()
  // const handleSyncList = (date: string) => {
  // }
  const getMeals = async (date: Dayjs) => {
    console.log('date', Date)
    // const requestUrl = `axios.get<IMeal[]>${apiUrlMealForOneDay}?cacheBuster=${date}`
    // console.log('requestUrl', requestUrl)
    // return requestUrl
    // const requestUrl = `${apiUrlMealForOneDay}?cacheBuster=${date.format('YYYY-MM-DD')}`
    const requestUrl = `${apiUrlMealForOneDay}/${date.format('YYYY-MM-DD')}?cacheBuster=${
      new Date().getTime()
    }`
    // const requestUrl1 = `${apiUrlMealForOneDay}/${date.format('YYYY-MM-DD')}}`
    // return axios.get<IMeal[]>(requestUrl)
    const { data } = await axios.get<IMealWithCustomer[]>(requestUrl)

    console.log('mealsOfDay', data)
    console.log('mealsWithCustomerData', mealsWithCustomerData)
    setMealsWithCustomerData(data)
  }

  return (
    <>
      {/* <div className="day popup-comment" style={style} onClick={() => toggle()}> */}
      <div className="day popup-comment" style={style}>
        <Button
          // variant={'see'}
          onClick={() => getMeals(date)}
          // isLoading={loading}
          // leftIcon={<FaSync />}
        >
          {date.format('ddd DD ')}
        </Button>
      </div>
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
          borderTopStyle: 'solid'
        } as React.CSSProperties}
      >
        <div
          style={{
            color: colorNumber('dinner', 'specialDiet')
          } as React.CSSProperties}
        >
          <Button
            // variant={'see'}
            // onClick={toto(date.format('YYYY-MM-DD'))}
            // isLoading={loading}
            // leftIcon={<FaSync />}
          >
            {mealsNumber?.breakfast}
          </Button>
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
            color: colorNumber('lunchtime', 'classicDiet')
          } as React.CSSProperties}
        >
          {mealsNumber?.lunchtime.classicDiet}
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
            color: colorNumber('lunchtime', 'specialDiet')
          } as React.CSSProperties}
        >
          {mealsNumber?.lunchtime.specialDiet}
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
            color: colorNumber('dinner', 'classicDiet')
          } as React.CSSProperties}
        >
          {mealsNumber?.dinner.classicDiet}
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
          {mealsNumber?.dinner.specialDiet}
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
