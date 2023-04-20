import { Text } from '@chakra-ui/react'
import type { Dayjs } from 'dayjs'
import type { FunctionComponent } from 'react'
import React from 'react'

interface IProps {
  month: number
  date: Dayjs
  totalDays: number
  numberOfDays: number
}

export const Months: FunctionComponent<IProps> = ({ month, date, totalDays, numberOfDays }) => {
  const offSet = numberOfDays === 7 ? 6 : 8

  // const endTable = totalDays + offSet
  const endTable = numberOfDays + offSet
  // Le jour de la date passé en paramétre.
  const today = date.date()

  // Remaining days of the month
  const remainingDays = totalDays - today + 1

  // Position de début vertical des cases. Si c'est le deuxième mois (month = 1), on ajoute les jours du mois précédent.
  const gridColumnStart = offSet + month * remainingDays
  // const gridColumnStart = month === 0 ?
  // offSet + month * remainingDays :
  // offSet + month * remainingDays + 1

  // Position de fin vertical des cases. Si c'est le deuxième mois (month = 1), la postion est absolu à la fin (endTable)
  // const gridColumnEnd = month === 0 ? offSet + remainingDays : endTable
  // const gridColumnEnd = endTable
  const gridColumnEnd = remainingDays < 4 ? offSet + remainingDays : endTable

  // console.log('gridColumnStart Months:', gridColumnStart)
  // console.log('remainingDays Months:', remainingDays)

  // const style = {
  //   gridColumnStart,
  //   gridColumnEnd
  // } as React.CSSProperties

  return (
    // <div className="month" style={style}>
    //   {date.add(month, 'month').format('MMMM')}a
    // </div>
    <Text
      className="month"
      gridColumnEnd={gridColumnEnd}
      gridColumnStart={gridColumnStart}
      textAlign={remainingDays < 4 ? 'start' : 'center'}
      py={2}
      borderColor={'#D9D9D9'}
      borderBottomWidth={'0.1em'}
      borderLeftWidth={'0.2em'}
      // borderRightWidth={'0.2em'}
      textTransform={'capitalize'}
      fontWeight={'bold'}
      backgroundColor={'white'}
    >
      {date.add(month, 'month').format('MMMM')}
    </Text>
  )
}
