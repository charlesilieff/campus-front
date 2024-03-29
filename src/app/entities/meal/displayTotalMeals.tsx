import { MoonIcon, SunIcon, TimeIcon } from '@chakra-ui/icons'
import { Box, FormLabel, Heading, HStack, Stack, VStack } from '@chakra-ui/react'
import React from 'react'

// const [isLargerThan1200] = useMediaQuery('(min-width: 1200px)')
/**
 * Display total during 31 days of :
 *  - breakfast
 * - classic lunch meals
 * - classic dinner meals
 * - special lunch meals
 * - special dinner meals
 * - classic meals
 * - special meals
 * - all meals
 * @param resultTotalMeals
 */
export const DisplayTotalMeals = ({ resultTotalMeals }: { resultTotalMeals: number[] }) => (
  <Box
    m={4}
    minW={'100%'}
    alignItems={'flex-start'}
    border={'solid'}
    p={4}
    borderRadius={8}
    borderColor={'#D9D9D9'}
  >
    <HStack m={4} spacing={8}>
      <Heading alignSelf={'flex-start'}>Résumé des repas sur la période</Heading>
    </HStack>

    <Stack
      m={4}
      spacing={8}
      direction={{ base: 'column', xl: 'row' }}
      display={'flex'}
    >
      <VStack
        border={'solid'}
        borderRadius={8}
        borderColor={'#D9D9D9'}
        alignItems={'flex-start'}
        backgroundColor={'yellow.50'}
        p={2}
      >
        <TimeIcon />
        <Stack
          minW={320}
          px={2}
          direction={['column', 'row']}
        >
          <FormLabel maxW={{ base: 180, sm: 300 }}>
            Total des petits-déjeuner
          </FormLabel>
          <FormLabel>{resultTotalMeals[7]}</FormLabel>
        </Stack>
      </VStack>

      <VStack
        border={'solid'}
        borderRadius={8}
        borderColor={'#D9D9D9'}
        alignItems={'flex-start'}
        p={2}
        backgroundColor={'orange.100'}
      >
        <SunIcon />
        <Stack
          minW={320}
          px={2}
          direction={['column', 'row']}
        >
          <FormLabel maxW={{ base: 180, sm: 300 }}>
            Total repas classiques du midi :
          </FormLabel>
          <FormLabel>{resultTotalMeals[0]}</FormLabel>
        </Stack>
        <Stack
          minW={320}
          px={2}
          direction={['column', 'row']}
        >
          <FormLabel maxW={{ base: 180, sm: 300 }}>Total repas spéciaux du midi :</FormLabel>
          <FormLabel>{resultTotalMeals[2]}</FormLabel>
        </Stack>

        <Stack
          minW={320}
          px={2}
          direction={['column', 'row']}
        >
          <FormLabel>Total repas du midi :</FormLabel>
          <FormLabel>{resultTotalMeals[0] + resultTotalMeals[2]}</FormLabel>
        </Stack>
      </VStack>

      <VStack
        border={'solid'}
        borderRadius={8}
        borderColor={'#D9D9D9'}
        alignItems={'flex-start'}
        p={2}
        backgroundColor={'#F7F7F7'}
      >
        <MoonIcon />
        <Stack
          minW={320}
          px={2}
          direction={['column', 'row']}
        >
          <FormLabel maxW={{ base: 180, sm: 300 }}>
            Total repas classiques du soir :
          </FormLabel>
          <FormLabel>{resultTotalMeals[1]}</FormLabel>
        </Stack>
        <Stack
          minW={320}
          px={2}
          direction={['column', 'row']}
        >
          <FormLabel maxW={{ base: 180, sm: 300 }}>Total repas spéciaux du soir :</FormLabel>
          <FormLabel>{resultTotalMeals[3]}</FormLabel>
        </Stack>

        <Stack
          minW={320}
          px={2}
          direction={['column', 'row']}
        >
          <FormLabel maxW={{ base: 180, sm: 300 }}>Total repas du soir :</FormLabel>
          <FormLabel>{resultTotalMeals[1] + resultTotalMeals[3]}</FormLabel>
        </Stack>
      </VStack>
    </Stack>

    <Stack
      border={'solid'}
      borderRadius={8}
      borderColor={'#D9D9D9'}
      alignItems={'flex-start'}
      p={2}
      backgroundColor={'gray.100'}
    >
      <Stack
        minW={320}
        px={2}
        direction={['column', 'row']}
      >
        <FormLabel maxW={{ base: 180, sm: 300 }}>
          Total repas classiques (hors petit-déj) :
        </FormLabel>
        <FormLabel>{resultTotalMeals[4]}</FormLabel>
      </Stack>
      <Stack
        minW={320}
        px={2}
        direction={['column', 'row']}
      >
        <FormLabel maxW={{ base: 180, sm: 300 }}>Total repas spéciaux (hors petit-déj) :</FormLabel>
        <FormLabel>{resultTotalMeals[5]}</FormLabel>
      </Stack>

      <Stack
        minW={320}
        px={2}
        direction={['column', 'row']}
      >
        <FormLabel maxW={{ base: 180, sm: 300 }}>Total repas (hors petit-déj) :</FormLabel>
        <FormLabel>{resultTotalMeals[6]}</FormLabel>
      </Stack>
    </Stack>
  </Box>
)
