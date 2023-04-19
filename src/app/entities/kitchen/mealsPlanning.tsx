import { MoonIcon, SunIcon, TimeIcon } from '@chakra-ui/icons'
import { Box, Grid, Text } from '@chakra-ui/react'
import { getDateKey } from 'app/shared/util/date-utils'
import type { Dayjs } from 'dayjs'
import React from 'react'
import { FaUtensils } from 'react-icons/fa'

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

  console.log('monthDays', monthDays)
  console.log('totalDays', totalDays)
  console.log('numberOfDays MealsPlanning', numberOfDays)

  // Objets contenant la position en x dans la grille des jours.
  const positionX = {}

  const positionX7Day = numberOfDays === 7 ? 6 : 8

  return (
    <Box>
      <Grid
        className="grid-container"
        borderColor={'#D9D9D9'}
        overflowX={'scroll'}
        overflowY={'hidden'}
        backgroundColor={'white'}
      >
        <Text
          gridRowStart={1}
          gridRowEnd={4}
          gridColumnStart={1}
          gridColumnEnd={numberOfDays === 7 ? 6 : 8}
          borderRightStyle={'solid'}
          borderRightWidth={'0.15em'}
          borderColor={'#D9D9D9'}
          py={2}
          // mt={'-0.1rem'}
          borderBottom={0}
          borderLeft={0}
          // backgroundColor={'blue.50'}
          justifyContent={'center'}
          display={'flex'}
          alignItems={'center'}
          p={2}
        >
          Repas &nbsp;<FaUtensils />
        </Text>
        <Text
          gridRowStart={4}
          gridRowEnd={5}
          gridColumnStart={1}
          gridColumnEnd={numberOfDays === 7 ? 6 : 8}
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
          p={2}
          backgroundColor={'yellow.50'}
        >
          Matin &nbsp;<TimeIcon />
        </Text>
        <Text
          gridRowStart={5}
          gridRowEnd={7}
          gridColumnStart={1}
          gridColumnEnd={numberOfDays === 7 ? 2 : 4}
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
          Midi &nbsp;<SunIcon />
        </Text>
        <Text
          gridRowStart={5}
          gridRowEnd={6}
          gridColumnStart={numberOfDays === 7 ? 2 : 4}
          gridColumnEnd={numberOfDays === 7 ? 6 : 8}
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
          gridColumnStart={numberOfDays === 7 ? 2 : 4}
          gridColumnEnd={numberOfDays === 7 ? 6 : 8}
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
          gridColumnEnd={numberOfDays === 7 ? 2 : 4}
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
          p={2}
        >
          Soir <MoonIcon />
        </Text>
        <Text
          gridRowStart={7}
          gridRowEnd={8}
          gridColumnStart={numberOfDays === 7 ? 2 : 4}
          gridColumnEnd={numberOfDays === 7 ? 6 : 8}
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
          gridColumnStart={numberOfDays === 7 ? 2 : 4}
          gridColumnEnd={numberOfDays === 7 ? 6 : 8}
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

        <Months date={date} month={0} totalDays={totalDays} numberOfDays={numberOfDays}></Months>
        {date.date() + numberOfDays - 1 > totalDays && (
          <Months date={date} month={1} totalDays={totalDays} numberOfDays={numberOfDays}></Months>
        )}

        {monthDays.map((_, index) => {
          const gridColumnStart = positionX7Day + index
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
