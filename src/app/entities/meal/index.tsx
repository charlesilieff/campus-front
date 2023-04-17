import { Box, Button, Heading, HStack, Input, Text, VStack } from '@chakra-ui/react'
import { useAppSelector } from 'app/config/store'
import type { IMeal } from 'app/shared/model/meal.model'
import axios from 'axios'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { FaCalendar } from 'react-icons/fa'

import { ConfirmationAddMealsScreenModal } from './confirmationAddMealsScreenModal'
import { ConfirmationRemoveMealsScreenModal } from './confirmationRemoveMealsScreenModal'
import { ConfirmationUpdateMealsByPeriodeModal } from './confirmationUpdateMealsByPeriodeModal'
import { ConfirmationUpdateMealsModal } from './confirmationUpdateMealsModal'
import { DisplayTotalMeals } from './displayTotalMeals'
import { MealsUserPlanning } from './mealsUserPlanning'

const apiUrlMealsDateFor31DaysByUser = 'api/meals/customer-id'
// const apiUrlUpdateMeal = 'api/meals/update'

export const Index = () => {
  const account = useAppSelector(state => state.authentication.account)

  const customerId = account.customerId

  const [date, setDate] = useState(dayjs())
  const [startDate, setStartDate] = useState(dayjs())
  const [endDate, setEndDate] = useState(dayjs())
  const [mealsData, setMealsData] = useState([] as IMeal[])
  const [numberOfDays, setNumberOfDays] = useState(31)

  useEffect(() => {
    const getMealsDateFor31DaysByUser = async (startDate: Dayjs, customerId: number) => {
      const requestUrl = `${apiUrlMealsDateFor31DaysByUser}/${customerId}/date/${
        startDate.format('YYYY-MM-DD')
      }`
      const { data } = await axios.get<IMeal[]>(requestUrl)

      // const dataSorted = data.sort((a, b) => (a > b.date ? 1 : -1))
      setMealsData(data)
    }
    getMealsDateFor31DaysByUser(date, customerId)
  }, [date])

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
      setNumberOfDays(15)
    } else {
      setNumberOfDays(31)
    }
  }

  return (
    <>
      <Box m={4}>
        <HStack m={4} spacing={8} margin={4} marginBlockEnd={12} alignItems={'flex-start'}>
          <Heading alignSelf={'flex-start'}>Changer mes repas par période</Heading>
        </HStack>
        <HStack m={4} spacing={8} margin={4} marginBlockEnd={12} alignItems={'flex-start'}>
          <Box>
            <Text>Du</Text>

            <Input
              type="date"
              onChange={e => setStartDate(dayjs(e.target.value))}
              title="Date de début"
            >
            </Input>
          </Box>
          <Box>
            <Text>Au</Text>
            <Input
              id="endDate"
              type="date"
              onChange={e => setEndDate(dayjs(e.target.value))}
              title="Date de fin"
            >
            </Input>
          </Box>
          {
            /* Todo later <Box>
            <Text>Se désinscrire</Text>
            <Checkbox
              id="unsubscribeDate"
              isChecked={true}
              onChange={newunsubscribeDate} // todo getMealsDateFor31DaysByUser
            >
            </Checkbox>
          </Box> */
          }
          <ConfirmationUpdateMealsByPeriodeModal
            startDate={startDate}
            endDate={endDate}
            customerId={customerId}
            setDate={setDate}
          />
        </HStack>

        <HStack m={4} spacing={8}>
          <Heading alignSelf={'flex-start'}>Mes repas réservés</Heading>
          <Box>
            <Input
              type="date"
              onChange={e => setDate(dayjs(e.target.value))} // todo getMealsDateFor31DaysByUser
            >
            </Input>
          </Box>

          <Button
            onClick={() => toggleNumberOfDays()}
            leftIcon={<FaCalendar />}
            color={'white'}
            backgroundColor={'#e95420'}
            _hover={{ textDecoration: 'none', color: 'orange' }}
          >
            {numberOfDays === 31 ? '15 jours' : '31 jours'}
          </Button>
        </HStack>

        <MealsUserPlanning
          date={date}
          totalDays={date.daysInMonth()}
          numberOfDays={numberOfDays}
          mealsData={mealsData}
        />
        <VStack m={4} spacing={8}>
          <ConfirmationUpdateMealsModal mealsData={mealsData} />
          <HStack>
            <ConfirmationRemoveMealsScreenModal
              mealsData={mealsData}
              date={date}
              numberOfDays={numberOfDays}
              setDate={setDate}
            />
            <ConfirmationAddMealsScreenModal
              mealsData={mealsData}
              date={date}
              numberOfDays={numberOfDays}
              setDate={setDate}
            />
          </HStack>
        </VStack>
      </Box>
      <DisplayTotalMeals resultTotalMeals={resultTotalMeals} />
    </>
  )
}

const calculateAccordingToNumberOfDays = (
  mealsDataDays: IMeal[],
  numberOfDays: number,
  mealsData: IMeal[],
  resultTotalMeals: number[],
  totalMeals: (table: number[]) => number
) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  mealsDataDays = new Array(numberOfDays)
  for (let i = 0; i < numberOfDays; i++) {
    mealsDataDays[i] = { ...mealsData[i] }
  }
  resultTotalMeals = totalMealsCalculation(mealsDataDays, totalMeals)
  return { mealsDataDays, resultTotalMeals }
}

/**
 * Calculate all the totals of meals.
 * @param mealsData : datas from context.
 * @param totalMeals : reducer, calculate a sum of numbers.
 * @returns : results of totals.
 */
const totalMealsCalculation = (mealsData: IMeal[], totalMeals: (table: number[]) => number) => {
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
