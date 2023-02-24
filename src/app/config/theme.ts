/* eslint-disable @typescript-eslint/naming-convention */
import { defineStyleConfig, extendTheme } from '@chakra-ui/react'
// eslint-disable-next-line import/no-default-export
const Button = defineStyleConfig({
  // Styles for the base style
  baseStyle: {},
  // Styles for the size variations
  sizes: {},
  // Styles for the visual style variations
  variants: {
    back: {
      bg: '#17a2b8',
      color: 'white',
      _hover: {
        bg: 'blue.600',
        color: 'white',
        textDecoration: 'none'
      }
    },
    save: {
      bg: '#28a745',
      color: 'white',
      _hover: {
        bg: 'green.600',
        color: 'white',
        textDecoration: 'none'
      }
    },
    danger: {
      bg: '#dc3545',
      color: 'white',
      _hover: {
        bg: 'red.600',
        color: 'white',
        textDecoration: 'none'
      }
    },
    modify: {
      bg: '#e95420',
      color: 'white',
      _hover: {
        bg: 'yellow.600',
        color: 'white',
        textDecoration: 'none'
      }
    },
    see: {
      bg: '#17a2b8',
      color: 'white',
      _hover: {
        bg: 'blue.600',
        color: 'white',
        textDecoration: 'none'
      }
    },
    menu: {
      bg: 'transparent',
      color: 'white'
    }
  },

  // The default `size` or `variant` values
  defaultProps: {}
})

const Table = defineStyleConfig({
  defaultProps: { variant: 'striped' }
})

export const theme = extendTheme({
  components: {
    Button,
    Table
  }
})
