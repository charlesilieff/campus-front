import { Box } from '@chakra-ui/react'
import type { IBed } from 'app/shared/model/bed.model'
import type { FunctionComponent } from 'react'
import React from 'react'

interface IProps {
  rowPosition: number
  index: number
  bed: IBed
}

export const Bed: FunctionComponent<IProps> = ({ rowPosition, index, bed }) => {
  const gridRowStart = rowPosition - 1 - index
  const gridRowEnd = rowPosition - index

  let style = {
    gridRowStart,
    gridRowEnd
  } as React.CSSProperties
  if (index === 0) {
    style = { ...style, borderBottom: '0.15em solid', borderBottomColor: '#D9D9D9' }
  }
  return (
    <>
      <Box className="beds" style={style} borderColor={'#D9D9D9'}>
        {bed.number}
      </Box>
      <div
        style={{
          ...style,
          gridColumnStart: 8,
          gridColumnEnd: 40,
          // borderolor: '#D9D9D9',
          borderBottom: index === 0 ? '' : '0.02em dashed',
          marginBottom: '-0.1em'
        }}
      >
      </div>
    </>
  )
}
