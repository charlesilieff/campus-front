import { Box, Text, VStack } from '@chakra-ui/react'
import type { Dayjs } from 'dayjs'
import React from 'react'

interface IProps {
  positionX: number
  date: Dayjs
}

export const Day = ({ positionX, date }: IProps) => {
  const dayWeek = date.day()
  const dayMonth = date.date()
  const style = {
    gridColumnStart: positionX,
    gridColumnEnd: positionX + 1,
    borderLeftWidth: '0.01em'
  } as React.CSSProperties
  if (positionX === 8 || date.date() === 1 || date.day() === 1) {
    style.borderLeftWidth = '0.2em'
  }

  return (
    <>
      <VStack className="day" style={style} px={1} borderColor={'#D9D9D9'}>
        <Text>{date.format('ddd')}</Text>
        <Text>{date.format('DD')}</Text>
      </VStack>
      {/*  */}
      <Box
        style={{
          borderLeftColor: dayMonth === 1 ? '#D9D9D9' : dayWeek === 1 ? '#D9D9D9' : '#D9D9D9',
          gridColumnStart: positionX,
          gridColumnEnd: positionX + 1,
          gridRowStart: 4,
          gridRowEnd: 50,
          borderLeftWidth: dayMonth === 1 ? '0.15em' : dayWeek === 1 ? '0.1em' : '0.05em',
          borderLeftStyle: dayMonth === 1 ? 'solid' : dayWeek === 1 ? 'solid' : 'solid'
        } as React.CSSProperties}
      >
      </Box>
    </>
  )
}
