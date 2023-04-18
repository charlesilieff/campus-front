import { Box, Button, FormLabel, Heading, HStack, Input, Stack, useMediaQuery,
  VStack } from '@chakra-ui/react'
import type { IMeal } from 'app/shared/model/meal.model'
import axios from 'axios'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { FaCalendar, FaCaretLeft, FaCaretRight } from 'react-icons/fa'

import type { IMealsNumber } from './IMealsNumber'
import { MealsContext } from './mealsContext'
import { MealsPlanning } from './mealsPlanning'

const apiUrlMealsDateFor31Days = 'api/meals/date'
interface IShowSavingProps {
  isShow: boolean
  message: string
}

export const Index = () => {
  const [date, setDate] = useState(dayjs())

  const [mealsData, setMealsData] = useState([] as IMeal[])

  const defaultSavingPopupProps: IShowSavingProps = { isShow: false, message: '' }
  const [showSavingPopup, setShowSavingPopup] = useState(defaultSavingPopupProps)
  const [numberOfDays, setNumberOfDays] = useState(31 as number)

  useEffect(() => {
    getMealsDateFor31Days(date)
  }, [date])

  useEffect(() => {
    if (showSavingPopup) {
      const timeId = setTimeout(() => {
        // After 3 seconds set the show value to false
        setShowSavingPopup({ isShow: false, message: '' })
      }, 3000)

      return () => {
        clearTimeout(timeId)
      }
    }
  }, [showSavingPopup])

  const newDatePlanning = (dateStart: React.ChangeEvent<HTMLInputElement>) => {
    setDate(dayjs(dateStart.target.value))
  }

  const toggleAddDays = () => {
    console.log('date', date)
    setDate(date.add(1, 'day'))
  }
  const toggleSubtractDays = () => {
    console.log('date', date)
    setDate(date.subtract(1, 'day'))
  }

  // On calcule le nombre de jours du mois de la date passée par l'utilisateur.
  // Si c'est égal à 31 on ne veut pas afficher le deuxiéme mois.
  const totalDays = date.daysInMonth()

  const getMealsDateFor31Days = async (startDate: Dayjs) => {
    const requestUrl = `${apiUrlMealsDateFor31Days}/${startDate.format('YYYY-MM-DD')}`
    const { data } = await axios.get<IMeal[]>(requestUrl)
    setMealsData(data)
  }

  /**
   * Définition du comportement d'affectation de données dans le contexte.
   * @param mealNumber : state
   * @param index : index de tableau (tableau de données de l'api)
   */
  const changeMeal = (mealsNumber: IMealsNumber, index: number) => {
    // Modification de la méthode : copie par valeur (spread)
    const newDefaultValue = [...mealsData]
    newDefaultValue[index] = {
      ...newDefaultValue[index],

      specialLunch: mealsNumber.lunchtime.specialDiet,
      specialDinner: mealsNumber.dinner.specialDiet,
      regularLunch: mealsNumber.lunchtime.classicDiet,
      regularDinner: mealsNumber.dinner.classicDiet,
      comment: mealsNumber.comment,
      breakfast: mealsNumber.breakfast
    }
    // Mise à jour du contexte : du nombre de repas à réaliser.
    setMealsData([...newDefaultValue])
  }

  /**
   * Calculation of total.
   */
  const totalMeals = (table: number[]) => {
    const add = (accumulator: number, a: number) => accumulator + a
    return table.reduce(add, 0) // with initial value to avoid when the array is empty
  }

  let resultTotalMeals: number[]
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  let mealsDataDays: IMeal[] = new Array(numberOfDays)
  ;({ mealsDataDays, resultTotalMeals } = calculateAccordingToNumberOfDays(
    mealsDataDays,
    numberOfDays,
    mealsData,
    resultTotalMeals,
    totalMeals
  ))

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;({ mealsDataDays, resultTotalMeals } = calculateAccordingToNumberOfDays(
      mealsDataDays,
      numberOfDays,
      mealsData,
      resultTotalMeals,
      totalMeals
    ))
  }, [mealsData, numberOfDays])

  /**
   * 15 days display or 31 days.
   */
  const toggleNumberOfDays = () => {
    if (numberOfDays === 31) {
      setNumberOfDays(7)
    } else {
      setNumberOfDays(31)
    }
  }

  return (
    <MealsContext.Provider value={[mealsData, changeMeal]}>
      <Box m={4}>
        <HStack m={4} spacing={8}>
          <Heading alignSelf={'flex-start'}>Cuisine - Total des repas réservés</Heading>
          <Button
            onClick={() => toggleSubtractDays()}
            leftIcon={<FaCaretLeft />}
            color={'white'}
            backgroundColor={'#e95420'}
            _hover={{ textDecoration: 'none', color: 'orange' }}
          >
          </Button>
          <Box>
            <Input
              type="date"
              onChange={newDatePlanning}
            >
            </Input>
          </Box>

          <Button
            onClick={() => toggleAddDays()}
            leftIcon={<FaCaretRight />}
            color={'white'}
            backgroundColor={'#e95420'}
            _hover={{ textDecoration: 'none', color: 'orange' }}
          >
          </Button>

          <Button
            onClick={() => toggleNumberOfDays()}
            leftIcon={<FaCalendar />}
            color={'white'}
            backgroundColor={'#e95420'}
            _hover={{ textDecoration: 'none', color: 'orange' }}
          >
            {numberOfDays === 31 ? '7 jours' : '31 jours'}
          </Button>
        </HStack>

        <MealsPlanning date={date} totalDays={totalDays} numberOfDays={numberOfDays} />
      </Box>
      {displayTotalMeals(resultTotalMeals)}
    </MealsContext.Provider>
  )
}

function calculateAccordingToNumberOfDays(
  mealsDataDays: IMeal[],
  numberOfDays: number,
  mealsData: IMeal[],
  resultTotalMeals: number[],
  totalMeals: (table: number[]) => number
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  mealsDataDays = new Array(numberOfDays)
  for (let i = 0; i < numberOfDays; i++) {
    mealsDataDays[i] = { ...mealsData[i] }
  }
  resultTotalMeals = totalMealsCalculation(mealsDataDays, totalMeals)
  return { mealsDataDays, resultTotalMeals }
}

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
function displayTotalMeals(resultTotalMeals: number[]) {
  // const [isLargerThan768] = useMediaQuery('(min-width: 768px)')
  const [isLargerThan1200] = useMediaQuery('(min-width: 1200px)')
  return (
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
        // minW={400}
        // direction={['column', 'row']}
        // direction={isLargerThan768 ? 'row' : 'column-reverse'}
        direction={isLargerThan1200 ? 'row' : 'column'}
        w={{ base: 'initial', md: '50%' }}
      >
        <VStack
          border={'solid'}
          borderRadius={8}
          borderColor={'#D9D9D9'}
          alignItems={'flex-start'}
          backgroundColor={'yellow.50'}
          p={2}
        >
          <Stack
            minW={320}
            px={2}
            direction={['column', 'row']}
          >
            <FormLabel>Total des petits-déjeuner</FormLabel>
            <FormLabel>{resultTotalMeals[7]}</FormLabel>
          </Stack>
        </VStack>

        <VStack
          border={'solid'}
          borderRadius={8}
          borderColor={'#D9D9D9'}
          alignItems={'flex-start'}
          p={2}
          backgroundColor={'#F2F2F2'}
        >
          <Stack
            minW={320}
            px={2}
            direction={['column', 'row']}
          >
            <FormLabel>Total repas classiques du midi :</FormLabel>
            <FormLabel>{resultTotalMeals[0]}</FormLabel>
          </Stack>
          <Stack
            minW={320}
            px={2}
            direction={['column', 'row']}
          >
            <FormLabel>Total repas spéciaux du midi :</FormLabel>
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
          backgroundColor={'orange.100'}
        >
          <Stack
            minW={320}
            px={2}
            direction={['column', 'row']}
          >
            <FormLabel>Total repas classiques du soir :</FormLabel>
            <FormLabel>{resultTotalMeals[1]}</FormLabel>
          </Stack>
          <Stack
            minW={320}
            px={2}
            direction={['column', 'row']}
          >
            <FormLabel>Total repas spéciaux du soir :</FormLabel>
            <FormLabel>{resultTotalMeals[3]}</FormLabel>
          </Stack>

          <Stack
            minW={320}
            px={2}
            direction={['column', 'row']}
          >
            <FormLabel>Total repas du soir :</FormLabel>
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
          <FormLabel>Total repas classiques (hors petit-déj) :</FormLabel>
          <FormLabel>{resultTotalMeals[4]}</FormLabel>
        </Stack>
        <Stack
          minW={320}
          px={2}
          direction={['column', 'row']}
        >
          <FormLabel>Total repas spéciaux (hors petit-déj) :</FormLabel>
          <FormLabel>{resultTotalMeals[5]}</FormLabel>
        </Stack>

        <Stack
          minW={320}
          px={2}
          direction={['column', 'row']}
        >
          <FormLabel>Total repas (hors petit-déj) :</FormLabel>
          <FormLabel>{resultTotalMeals[6]}</FormLabel>
        </Stack>
      </Stack>
    </Box>
    // <div className="row">
    //   <div className="col-5">
    //     <div id="total" className="col">
    //       {`Total des petits-déjeuner: ${resultTotalMeals[7]}`}
    //     </div>
    //     <div id="total" className="col">
    //       {`Total repas classiques de midi: ${resultTotalMeals[0]}`}
    //     </div>
    //     <div id="total" className="col">
    //       {`Total repas classiques du soir: ${resultTotalMeals[1]}`}
    //     </div>
    //     <div id="total" className="col">
    //       {`Total repas spéciaux de midi: ${resultTotalMeals[2]}`}
    //     </div>
    //     <div id="total" className="col">
    //       {`Total repas spéciaux du soir: ${resultTotalMeals[3]}`}
    //     </div>
    //   </div>
    //   <div className="col-4">
    //     <div id="total" className="col">
    //       <br />
    //     </div>
    //     <div id="total" className="col">
    //       {`Total repas classiques: ${resultTotalMeals[4]}`}
    //     </div>
    //     <div id="total" className="col">
    //       <br />
    //     </div>
    //     <div id="total" className="col">
    //       {`Total repas spéciaux: ${resultTotalMeals[5]}`}
    //     </div>
    //   </div>
    //   <div className="col-4">
    //     <div id="total" className="col">
    //       <br />
    //     </div>
    //     <div id="total" className="col">
    //       <br />
    //     </div>
    //     <div id="total" className="col">
    //       <br />
    //       {' '}
    //     </div>
    //     <div id="total" className="col">
    //       {`Total repas: ${resultTotalMeals[6]}`}
    //     </div>
    //   </div>
    // </div>
  )
}

/**
 * Calculate all the totals of meals.
 * @param mealsData : datas from context.
 * @param totalMeals : reducer, calculate a sum of numbers.
 * @returns : results of totals.
 */
function totalMealsCalculation(mealsData: IMeal[], totalMeals: (table: number[]) => number) {
  // regularLunch: calculation of total.

  let table: number[] = mealsData.map(meals => meals.regularLunch)

  const totalRegularLunch: number = totalMeals(table)

  table = mealsData.map(meals => meals.regularDinner)
  const totalRegularDinner: number = totalMeals(table)

  // specialLunch: calculation of total.
  table = mealsData.map(meals => meals.specialLunch)
  const totalSpecialLunch: number = totalMeals(table)

  // specialDinner: calculation of total.
  table = mealsData.map(meals => meals.specialDinner)
  const totalSpecialDinner: number = totalMeals(table)

  const totalRegular: number = totalRegularDinner + totalRegularLunch
  const totalSpecial: number = totalSpecialDinner + totalSpecialLunch
  const total: number = totalRegular + totalSpecial

  // breakfast: calculation of total .
  table = mealsData.map(meals => meals.breakfast)
  const totalBreakfast: number = totalMeals(table)

  const result: number[] = [
    totalRegularLunch,
    totalRegularDinner,
    totalSpecialLunch,
    totalSpecialDinner,
    totalRegular,
    totalSpecial,
    total,
    totalBreakfast
  ]

  return result
}
