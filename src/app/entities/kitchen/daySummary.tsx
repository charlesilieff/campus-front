import type { Dayjs } from 'dayjs'
import React, { useContext } from 'react'

import type { IMealsNumber } from './IMealsNumber'
import { MealsContext } from './mealsContext'

interface IProps {
  positionX: number
  date: Dayjs
  index: number
}

export const DaySummary = ({ positionX, date, index }: IProps) => {
  const dayWeek = date.day()
  const dayMonth = date.date()

  const mealsContext = useContext(MealsContext)[0]

  const style = {
    gridColumnStart: positionX,
    gridColumnEnd: positionX + 1,
    borderLeftWidth: '0.01em'
  } as React.CSSProperties
  if (positionX === 8 || date.date() === 1 || date.day() === 1) {
    style.borderLeftWidth = '0.2em'
  }

  const mealsNumberReferential: IMealsNumber = {
    breakfast: mealsContext[index].breakfast,
    lunchtime: {
      classicDiet: mealsContext[index].regularLunch,
      specialDiet: mealsContext[index].specialLunch
    },
    dinner: {
      classicDiet: mealsContext[index].regularDinner,
      specialDiet: mealsContext[index].specialDinner
    },
    comment: mealsContext[index].comment
  }

  const colorNumber = (differential: number) => {
    let color: string

    if (differential === 0) {
      color = 'black'
    } else if (differential < 0) {
      color = 'red'
    } else {
      color = 'green'
    }
    return color
  }

  return (
    <>
      <div className="day" style={style}>
        toto
      </div>
      {
        /* <div className="day" style={style}>
        {date.format('ddd DD ')}
      </div> */
      }
      {
        /* <div
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
        <div>
          {mealsNumberReferential?.breakfast}
          <div
            style={{
              color: colorNumber(mealsNumberReferential?.breakfast)
            } as React.CSSProperties}
          >
            wtf
          </div>
        </div>
      </div> */
      }
      {
        /* <div
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
        <div>
          {mealsNumberReferential?.lunchtime.classicDiet}
          <div
            style={{
              color: colorNumber(mealsNumberReferential?.lunchtime.classicDiet)
            } as React.CSSProperties}
          >
            wtf
          </div>
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
          borderTopStyle: 'solid'
        } as React.CSSProperties}
      >
        <div>
          {mealsNumberReferential?.lunchtime.specialDiet}
          <div
            style={{
              color: colorNumber(mealsNumberReferential?.lunchtime.specialDiet)
            } as React.CSSProperties}
          >
            wtf
          </div>
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
          borderTopStyle: 'solid'
        } as React.CSSProperties}
      >
        <div>
          {mealsNumberReferential?.dinner.classicDiet}
          <div
            style={{
              color: colorNumber(mealsNumberReferential?.dinner.classicDiet)
            } as React.CSSProperties}
          >
            wtf
          </div>
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
        <div>
          {mealsNumberReferential?.dinner.specialDiet}
          <div
            style={{
              color: colorNumber(mealsNumberReferential?.dinner.specialDiet)
            } as React.CSSProperties}
          >
            wtf
          </div>
        </div>
      </div> */
      }
    </>
  )
}
