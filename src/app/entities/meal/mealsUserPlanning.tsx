import { Checkbox } from '@chakra-ui/react'
import type { IMeal } from 'app/shared/model/meal.model'
import { getDateKey } from 'app/shared/util/date-utils'
import type { Dayjs } from 'dayjs'
import React from 'react'

import { Day } from './day'
import { Months } from './months'

interface IProps {
  date: Dayjs
  totalDays: number
  numberOfDays: number
  mealsData: IMeal[]
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
  { date, totalDays, numberOfDays, mealsData }: IProps
) => {
  // On souhaite afficher 31 jours => Tableau de 31 élements.
  const monthDays = Array.from({ length: numberOfDays })

  const handleChangeBreakfast: React.ChangeEventHandler<HTMLInputElement> = event => {
    console.log('handleChangeBreakfast', event.target.checked)
  }

  // Objets contenant la position en x dans la grille des jours.
  const positionX = {}

  return (
    <div className="grid-container" style={gridFormatStyle(numberOfDays)}>
      <div className="time breakfast">Matin</div>
      <div className="time lunch">Midi</div>
      <div className="time dinner">Soir</div>

      <div className="diet breakfast">
        <Checkbox
          onChange={handleChangeBreakfast}
          isChecked={true}
        />
      </div>
      <div className="diet lunch">
        <Checkbox
          onChange={handleChangeBreakfast}
          isChecked={true}
        />
      </div>
      <div className="diet dinner">
        <Checkbox
          onChange={handleChangeBreakfast}
          isChecked={true}
        />
      </div>

      <Months date={date} month={0} totalDays={totalDays}></Months>

      {date.date() + numberOfDays - 1 > totalDays && (
        <Months date={date} month={1} totalDays={totalDays}></Months>
      )}

      {monthDays.map((_, index) => {
        const gridColumnStart = 8 + index
        // On construit l'objet qui va permettre de récuperer la bonne position en X pour afficher les réservations.
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
          />
        )
      })}
    </div>
  )
}

/**
 * Style of the grid according to the number of days.
 * @param numberOfDays
 * @returns
 */
function gridFormatStyle(numberOfDays: number) {
  const style = {} as React.CSSProperties
  if (numberOfDays === 15) {
    style.borderLeftWidth = '0.2em'
    style.gridTemplateColumns = '3em repeat(21, minmax(20px, 1fr))'
  }
  return style
}
