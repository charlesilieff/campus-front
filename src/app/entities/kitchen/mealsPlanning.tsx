import { MoonIcon, SunIcon, TimeIcon } from '@chakra-ui/icons'
import { Box, Grid, Text } from '@chakra-ui/react'
import { getDateKey } from 'app/shared/util/date-utils'
import type { Dayjs } from 'dayjs'
import React from 'react'

import { Day } from './day'
import { Months } from './months'

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
export const MealsPlanning = ({ date, totalDays, numberOfDays }: IProps) => {
  // On souhaite afficher 31 jours => Tableau de 31 élements.
  const monthDays = Array.from({ length: numberOfDays })

  // Objets contenant la position en x dans la grille des jours.
  const positionX = {}

  return (
    <Box>
      <Grid
        className="grid-container"
        borderColor={'#D9D9D9'}
        overflowX={'scroll'}
        overflowY={'hidden'}
      >
        <Text
          gridRowStart={4}
          gridRowEnd={5}
          gridColumnStart={1}
          gridColumnEnd={8}
          textAlign={'center'}
          overflowWrap={'break-word'}
          borderTopStyle={'solid'}
          borderRightStyle={'solid'}
          borderWidth={'0.15em'}
          borderColor={'#D9D9D9'}
          py={2}
          mt={'-0.1rem'}
          borderBottom={0}
          borderLeft={0}
          backgroundColor={'yellow.50'}
        >
          Matin <TimeIcon />
        </Text>
        <Text
          gridRowStart={5}
          gridRowEnd={7}
          gridColumnStart={1}
          gridColumnEnd={4}
          textAlign={'center'}
          overflowWrap={'break-word'}
          borderTopStyle={'solid'}
          borderRightStyle={'solid'}
          borderWidth={'0.15em'}
          borderColor={'#D9D9D9'}
          // py={2}
          mt={'-0.1rem'}
          borderBottom={0}
          borderLeft={0}
          alignContent={'center'} // TODO : center??
          verticalAlign={'middle'} // TODO : center??
          // center
          backgroundColor={'#F7F7F7'}
          p={2}
        >
          Midi <SunIcon />
        </Text>
        <Text
          gridRowStart={5}
          gridRowEnd={6}
          gridColumnStart={4}
          gridColumnEnd={8}
          textAlign={'center'}
          overflowWrap={'break-word'}
          borderTopStyle={'solid'}
          borderRightStyle={'solid'}
          borderWidth={'0.15em'}
          borderColor={'#D9D9D9'}
          p={2}
          mt={'-0.1rem'}
          borderBottom={0}
          borderLeft={0}
          backgroundColor={'#F7F7F7'}
        >
          Repas normaux
        </Text>
        <Text
          gridRowStart={6}
          gridRowEnd={7}
          gridColumnStart={4}
          gridColumnEnd={8}
          textAlign={'center'}
          overflowWrap={'break-word'}
          borderTopStyle={'solid'}
          borderRightStyle={'solid'}
          borderWidth={'0.15em'}
          borderColor={'#D9D9D9'}
          py={2}
          mt={'-0.1rem'}
          borderBottom={0}
          borderLeft={0}
          backgroundColor={'#F7F7F7'}
        >
          Repas Sans lactose ni gluten
        </Text>
        <Text
          gridRowStart={7}
          gridRowEnd={9}
          gridColumnStart={1}
          gridColumnEnd={4}
          textAlign={'center'}
          overflowWrap={'break-word'}
          borderTopStyle={'solid'}
          borderRightStyle={'solid'}
          borderWidth={'0.15em'}
          borderColor={'#D9D9D9'}
          py={2}
          mt={'-0.1rem'}
          borderBottom={0}
          borderLeft={0}
          backgroundColor={'orange.100'}
        >
          Soir <MoonIcon />
        </Text>
        <Text
          gridRowStart={7}
          gridRowEnd={8}
          gridColumnStart={4}
          gridColumnEnd={8}
          textAlign={'center'}
          overflowWrap={'break-word'}
          borderTopStyle={'solid'}
          borderRightStyle={'solid'}
          borderWidth={'0.15em'}
          borderColor={'#D9D9D9'}
          py={2}
          mt={'-0.1rem'}
          borderBottom={0}
          borderLeft={0}
          backgroundColor={'orange.100'}
        >
          Repas normaux
        </Text>
        <Text
          gridRowStart={8}
          gridRowEnd={9}
          gridColumnStart={4}
          gridColumnEnd={8}
          textAlign={'center'}
          overflowWrap={'break-word'}
          borderTopStyle={'solid'}
          borderRightStyle={'solid'}
          borderWidth={'0.15em'}
          borderColor={'#D9D9D9'}
          py={2}
          mt={'-0.1rem'}
          borderBottom={0}
          borderLeft={0}
          backgroundColor={'orange.100'}
        >
          Repas Sans lactose ni gluten
        </Text>

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
          return <Day positionX={gridColumnStart} key={dateKey} date={dateDay} index={index}></Day>
        })}
      </Grid>
    </Box>
    // <div className="grid-container" style={gridFormatStyle(numberOfDays)}>
    //   <div className="time breakfast">Matin</div>
    //   <div className="time lunch">Midi</div>
    //   <div className="time dinner">Soir</div>

    //   <div className="diet dietbreakfast">Total</div>
    //   <div className="diet specialdietlunch">Sans lactose ni gluten</div>
    //   <div className="diet classicdietlunch">Classique</div>
    //   <div className="diet specialdietdinner">Sans lactose ni gluten</div>
    //   <div className="diet classicdietdinner">Classique</div>

    //   <Months date={date} month={0} totalDays={totalDays}></Months>

    // {date.date() + numberOfDays - 1 > totalDays && (
    //   <Months date={date} month={1} totalDays={totalDays}></Months>
    // )}

    // {monthDays.map((_, index) => {
    //   const gridColumnStart = 8 + index
    //   // On construit l'objet qui va permettre de récuperer la bonne position en X pour afficher les réservations.
    //   const dateDay = date.add(index, 'day')
    //   const dateKey = getDateKey(dateDay)
    //   positionX[dateKey] = gridColumnStart
    //   return <Day positionX={gridColumnStart} key={dateKey} date={dateDay} index={index}></Day>
    // })}
    // </div>
  )
}

// /**
//  * Style of the grid according to the number of days.
//  * @param numberOfDays
//  * @returns
//  */
// function gridFormatStyle(numberOfDays: number) {
//   const style = {} as React.CSSProperties
//   if (numberOfDays === 15) {
//     style.borderLeftWidth = '0.2em'
//     style.gridTemplateColumns = '3em repeat(21, minmax(20px, 1fr))'
//   }
//   return style
// }
