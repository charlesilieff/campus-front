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
    }
  },
  // The default `size` or `variant` values
  defaultProps: {}
})

export const theme = extendTheme({
  components: {
    Button
  }
})
