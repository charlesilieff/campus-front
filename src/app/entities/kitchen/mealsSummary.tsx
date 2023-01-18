import { getDateKey } from 'app/shared/util/date-utils'
import { Dayjs } from 'dayjs'
import React from 'react'
import DaySummary from './daySummary'
import Months from './months'

interface IProps {
  date: Dayjs
  totalDays: number
  numberOfDays: number
}

/**
 * Affiche un tableau (colonne : les jours (calendrier)).
 * Chaque jour (Day) comporte les informations suivantes :
 *  - Repas de midi :
 *        - régime spécial
 *        - régime classique
 *  - Repas du soir.
 */
const KitchenSummary = ({ date, totalDays, numberOfDays }: IProps) => {
  // On souhaite afficher 31 jours => Tableau de 31 élements.
  const monthDays = Array.from({ length: numberOfDays })

  // Objets contenant la position en x dans la grille des jours.
  const positionX = {}

  // Objets contenant la position en y dans la grille des lits.
  const positionY = {}
  const positionYEnd = {}

  return (
    <div className="grid-container" style={gridFormatStyle(numberOfDays)}>
      <div className="time lunch">Midi</div>
      <div className="time dinner">Soir</div>
      <div className="diet specialdietlunch">Sans lactose ni gluten</div>
      <div className="diet classicdietlunch">Classique</div>
      <div className="diet specialdietdinner">Sans lactose ni gluten</div>
      <div className="diet classicdietdinner">Classique</div>
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
          <DaySummary positionX={gridColumnStart} key={dateKey} date={dateDay} index={index}>
          </DaySummary>
        )
      })}
    </div>
  )
}

export default KitchenSummary

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
