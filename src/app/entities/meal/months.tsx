import type { Dayjs } from 'dayjs'
import type { FunctionComponent } from 'react'
import React from 'react'

interface IProps {
  month: number
  date: Dayjs
  totalDays: number
}

export const Months: FunctionComponent<IProps> = ({ month, date, totalDays }) => {
  const offSet = 8 * 2

  const endTable = 39 * 2
  // Le jour de la date passé en paramétre.
  const today = date.date()

  // Remaining days of the month
  const remainingDays = totalDays - today + 1

  // Position de début vertical des cases. Si c'est le deuxième mois (month = 1), on ajoute les jours du mois précédent.
  const gridColumnStart = offSet + month * remainingDays

  // Position de fin vertical des cases. Si c'est le deuxième mois (month = 1), la postion est absolu à la fin (endTable)
  const gridColumnEnd = month === 0 ? offSet + remainingDays : endTable

  const style = {
    gridColumnStart,
    gridColumnEnd
  } as React.CSSProperties

  return (
    <div className="month" style={style}>
      {date.add(month, 'month').format('MMMM')}
    </div>
  )
}