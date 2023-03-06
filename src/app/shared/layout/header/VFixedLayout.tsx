import { Box, VStack } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import React from 'react'

export const VFixedLayout: React.FC<{
  top?: ReactNode
  main: ReactNode
  bottom?: ReactNode
}> = ({ bottom, main, top }) => (
  <VStack width={'100%'} height={'100vh'} alignItems={'stretch'}>
    <Box>{top}</Box>
    <Box flexGrow={1} overflowY={'scroll'}>{main}</Box>
    <Box>{bottom}</Box>
  </VStack>
)
