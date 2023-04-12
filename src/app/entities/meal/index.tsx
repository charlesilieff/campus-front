import { Box, Button, Checkbox, Heading, HStack, Input, Text } from '@chakra-ui/react'
import { useAppSelector } from 'app/config/store'
import type { IMeal } from 'app/shared/model/meal.model'
import axios from 'axios'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { FaCalendar } from 'react-icons/fa'
import { FaSave } from 'react-icons/fa'

import { ConfirmationUpdateMealsModal } from './confirmationUpdateMealsModal'
import { DisplayTotalMeals } from './displayTotalMeals'
import { MealsUserPlanning } from './mealsUserPlanning'

const apiUrlMealsDateFor31DaysByUser = 'api/meals/customer-id'
const apiUrlUpdateMeal = 'api/meals/update'

export const Index = () => {
  const account = useAppSelector(state => state.authentication.account)

  const customerId = account.customerId

  const [date, setDate] = useState(dayjs())
  const [startDate, setStartDate] = useState(dayjs())
  const [endDate, setEndDate] = useState(dayjs())
  const [unsubscribeDate, setUnsubscribeDate] = useState(true)
  const [mealsData, setMealsData] = useState([] as IMeal[])
  const [mealsDataBetweenDate, setMealsDataBetweenDate] = useState([] as IMeal[])
  const [numberOfDays, setNumberOfDays] = useState(31)

  useEffect(() => {
    const getMealsDateFor31DaysByUser = async (startDate: Dayjs, customerId: number) => {
      const requestUrl = `${apiUrlMealsDateFor31DaysByUser}/${customerId}/date/${
        startDate.format('YYYY-MM-DD')
      }`
      const { data } = await axios.get<IMeal[]>(requestUrl)
      console.log('data axios', data)
      setMealsData(data)
    }
    getMealsDateFor31DaysByUser(date, customerId)
  }, [date])

  const newunsubscribeDate = () => { // todo
    setUnsubscribeDate(false)
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
      setNumberOfDays(15)
    } else {
      setNumberOfDays(31)
    }
  }

  /**
   * update meals with start date and end date
   */
  const getMealsBetweenTwoDateByUser = async (
    startDate: Dayjs,
    endDate: Dayjs,
    customerId: number
  ) => {
    const requestUrl = `${apiUrlMealsDateFor31DaysByUser}/${customerId}/date1/${
      startDate.format('YYYY-MM-DD')
    }/date2/${endDate.format('YYYY-MM-DD')}`
    const { data } = await axios.get<IMeal[]>(requestUrl)
    console.log('data axios', data)
    setMealsDataBetweenDate(data)
    console.log('data 2 date', data)
  }
  // const updateMealsFromDate = (entity: IMeal[]) => {
  const updateMealsFromDate = () => {
    console.log('startDate', startDate.format('YYYY-MM-DD'))
    console.log('endDate', endDate.format('YYYY-MM-DD'))
    console.log('checkbox unsubscribe', unsubscribeDate)

    getMealsBetweenTwoDateByUser(startDate, endDate, customerId)

    const mealsDataBetweenDateUpdate = mealsDataBetweenDate.map((value, index) => {
      value = {
        ...value,
        specialLunch: 0,
        specialDinner: 0,
        regularLunch: 0,
        regularDinner: 0,
        comment: mealsData[index].comment,
        breakfast: 0
      }
      return value
    })

    console.log('mealsDataBetweenDateUpdate', mealsDataBetweenDateUpdate)

    const result = axios.put<IMeal>(
      apiUrlUpdateMeal,
      mealsDataBetweenDateUpdate
    )

    return result
  }
  const updateMeals = async (entity: IMeal[]) =>
    await axios.put<IMeal>(
      apiUrlUpdateMeal,
      entity.filter(value => value.id !== undefined)
    )

  /**
   * select meals of planning
   */
  const selectMealsOnPeriode = (entity: IMeal[], date: Dayjs, numberOfDays: number) => {
    // Modification de la méthode : copie par valeur (spread)
    console.log('entity', entity)
    console.log('date', date)
    console.log('numberOfDays', numberOfDays)

    // const entity1 = entity.filter(value => value.date === date.format('YYYY-MM-DD'))

    entity = entity.map((value, index) => {
      console.log('value', value)
      value = {
        ...value,
        specialLunch: 0,
        specialDinner: 0,
        regularLunch: 0,
        regularDinner: 0,
        comment: mealsData[index].comment,
        breakfast: 0
      }
      console.log('value', value)
      return value
    })

    console.log('entity', entity)
    updateMeals(entity)
  }

  return (
    <>
      <Box m={4}>
        <HStack m={4} spacing={8}>
          <Heading alignSelf={'flex-start'}>Changer mes repas par période</Heading>
          <Box>
            <Text>Du</Text>

            <Input
              type="date"
              onChange={e => setStartDate(dayjs(e.target.value))} // todo getMealsDateFor31DaysByUser
              title="Date de début"
            >
            </Input>
          </Box>
          <Box alignSelf={'flex-start'}>
            <Text>Au</Text>
            <Input
              id="endDate"
              type="date"
              onChange={e => setEndDate(dayjs(e.target.value))} // todo getMealsDateFor31DaysByUser
              title="Date de fin"
            >
            </Input>
          </Box>
          <Box>
            <Text>Se désinscrire</Text>
            <Checkbox
              id="unsubscribeDate"
              isChecked={true}
              onChange={newunsubscribeDate} // todo getMealsDateFor31DaysByUser
            >
            </Checkbox>
          </Box>

          <Button
            onClick={() => updateMealsFromDate()} // , startDate, endDate, checkboxTwoDate
            leftIcon={<FaSave />}
            colorScheme={'green'}
            _hover={{
              textDecoration: 'none',
              color: '#17a2b8',
              backgroundColor: '#38A169'
            }}
          >
            Enregistrer
          </Button>
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

        <Button
          type="submit"
          onClick={() => selectMealsOnPeriode(mealsData, date, numberOfDays)}
          // isLoading={updating}
          leftIcon={<FaSave />}
          variant={'update'}
        >
          Tout selectionner/déselectionner
        </Button>
        <ConfirmationUpdateMealsModal mealsData={mealsData} />
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
