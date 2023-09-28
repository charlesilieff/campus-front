import {
  Box,
  Button,
  Checkbox,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  Tooltip,
  useToast,
  VStack
} from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import {
  getOneBedUserReservationsByUserId,
  getReservation
} from 'app/entities/reservation/reservation.reducer'
import type { IMeal } from 'app/shared/model/meal.model'
import axios from 'axios'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { Option as O, pipe, ReadonlyArray as A } from 'effect'
import React, { useEffect, useState } from 'react'
import { FaCalendar, FaCaretLeft, FaCaretRight } from 'react-icons/fa'

import { ConfirmationUpdateMealsByPeriodModal } from './confirmationUpdateMealsByPeriodeModal'
import { ConfirmationUpdateMealsModal } from './confirmationUpdateMealsModal'
import { DisplayTotalMeals } from './displayTotalMeals'
import { MealsUserPlanning } from './mealsUserPlanning'

const apiUrlMealsDateFor31DaysByUser = 'api/meals'

export const MealTable = () => {
  const toast = useToast()
  const account = useAppSelector(state => state.authentication.account)

  const [refreshing, setRefreshing] = useState(false)
  const [date, setDate] = useState(dayjs())
  const [startDate, setStartDate] = useState<O.Option<Dayjs>>(O.none())
  const [endDate, setEndDate] = useState<O.Option<Dayjs>>(O.none())
  const [mealsData, setMealsData] = useState([] as IMeal[])
  const [numberOfDays, setNumberOfDays] = useState(31)
  const [isMealDataUpdated, setIsMealDataUpdated] = useState(true)
  const handleSetMealsData = (mealsData: IMeal[]) => {
    setMealsData(mealsData)
    setIsMealDataUpdated(false)
  }
  /**
   * Get Reservations by user.
   */

  const dispatch = useAppDispatch()

  const userId = O.flatMap(account, a => a.id)
  const customerId = O.flatMap(account, a => a.customerId)

  const reservationList = pipe(
    useAppSelector(state => state.reservation.entities),
    A.filter(x =>
      dayjs(dayjs(x?.departureDate)).isAfter(
        date.subtract(1, 'day').format('YYYY-MM-DD'),
        'day'
      )
    ),
    A.filter(x =>
      dayjs(dayjs(x?.arrivalDate)).isBefore(
        date.format('YYYY-MM-DD'),
        'day'
      )
    )
  )

  useEffect(() => {
    if (O.isSome(userId)) dispatch(getOneBedUserReservationsByUserId(userId.value))

    if (reservationList.length > 0 && O.isSome(reservationList[0].id)) {
      dispatch(getReservation(reservationList[0].id.value))
    }
  }, [])

  /**
   * Get meals for 31 days by user. //todo getMealsDateFor31DaysByUser by reservation
   */
  useEffect(() => {
    const getMealsDateFor31DaysByUser = async (startDate: Dayjs, customerId: number) => {
      const requestUrl = `${apiUrlMealsDateFor31DaysByUser}/customer-id/${customerId}/date/${
        startDate.format('YYYY-MM-DD')
      }`
      const { data } = await axios.get<IMeal[]>(requestUrl)

      setMealsData(data)
      setRefreshing(false)
    }
    pipe(customerId, O.map(customerId => getMealsDateFor31DaysByUser(date, customerId)))
  }, [date, refreshing])
  /**
   * Get meals for 31 days by reservation. //todo getMealsDateFor31DaysByUser by reservation
   */
  // useEffect(() => {
  //   const getMealsDateFor31DaysByReservation = async (startDate: Dayjs, reservationId: number) => {
  //     const requestUrl = `${apiUrlMealsDateFor31DaysByUser}/reservation-id/${reservationId}/date/${
  //       startDate.format('YYYY-MM-DD')
  //     }`
  //     const { data } = await axios.get<IMeal[]>(requestUrl)
  //     console.log('data axios', data)

  //     // const dataSorted = data.sort((a, b) => (a > b.date ? 1 : -1))
  //     // TODO stand-by setMealsData(data)
  //   }
  //   getMealsDateFor31DaysByReservation(date, reservationId)
  // }, [reservationId, date])

  /**
   * Calculation of total.
   */
  const totalMeals = (table: number[]) => {
    const add = (accumulator: number, a: number) => accumulator + a
    return table.reduce(add, 0) // with initial value to avoid when the array is empty
  }

  let resultTotalMeals: number[] = []
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
    // eslint-disable-next-line no-extra-semi
    ;({ mealsDataDays, resultTotalMeals } = calculateAccordingToNumberOfDays(
      mealsDataDays,
      numberOfDays,
      mealsData,
      resultTotalMeals,
      totalMeals
    ))
  }, [mealsData, numberOfDays])

  /**
   * 7 days display or 31 days.
   */
  const toggleNumberOfDays = () => {
    if (numberOfDays === 31) {
      setNumberOfDays(7)
    } else {
      setNumberOfDays(31)
    }
  }

  const toggleAddDays = () => {
    setDate(date.add(1, 'day'))
    if (O.isSome(userId)) dispatch(getOneBedUserReservationsByUserId(userId.value))

    if (O.isSome(reservationList[0].id)) dispatch(getReservation(reservationList[0].id.value))

    if (reservationList.length > 0) {
      console.error('erreur plusieurs réservation', reservationList.length)
    }
  }
  const toggleSubtractDays = () => {
    setDate(date.subtract(1, 'day'))
    if (O.isSome(userId)) dispatch(getOneBedUserReservationsByUserId(userId.value))
  }

  const startDateChange = (e: Dayjs) => {
    if (dayjs(e).isBefore(dayjs().subtract(1, 'day'))) {
      toast({
        position: 'bottom',
        title: 'Erreur date !',
        description: "La date de début ne peut pas être antérieure à aujourd'hui.",
        status: 'error',
        duration: 4000,
        isClosable: true
      })
    }
    if (O.isSome(endDate) && dayjs(e).isAfter(endDate.value)) {
      toast({
        position: 'bottom',
        title: 'Erreur date !',
        description: 'La date de début ne peut pas être postérieure à la date de fin.',
        status: 'error',
        duration: 4000,
        isClosable: true
      })
    }
    setStartDate(O.some(dayjs(e)))
  }
  const startEndChange = (e: Dayjs) => {
    if (O.isSome(startDate) && dayjs(e).isBefore(startDate.value)) {
      toast({
        position: 'bottom',
        title: 'Erreur date !',
        description: 'La date de fin ne peut pas être antérieure à la date de début.',
        status: 'error',
        duration: 4000,
        isClosable: true
      })
      setEndDate(O.some(dayjs(e)))
    } else {
      setEndDate(O.some(dayjs(e)))
    }
  }
  const isSpecialMeal = mealsData.some(m => !(m.regularDinner === 1))

  return (
    <>
      <Stack m={4}>
        <Heading alignSelf={'flex-start'}>Mes repas réservés</Heading>
        <Stack direction={{ base: 'column', md: 'row' }} justifyContent={'center'}>
          <HStack m={4} spacing={8}>
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
                onChange={e => setDate(dayjs(e.target.value))}
                value={date.format('YYYY-MM-DD')}
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
          </HStack>
          <HStack m={4} spacing={8} py={4} justifyContent={'center'}>
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
        </Stack>

        <MealsUserPlanning
          date={date}
          totalDays={date.daysInMonth()}
          numberOfDays={numberOfDays}
          mealsData={mealsData}
          setMealsData={handleSetMealsData}
          isSpecialMeal={isSpecialMeal}
        />
        <VStack m={4} spacing={8} justifyContent={'center'}>
          <Tooltip
            label="Utilisez la page de gestion de votre réservation pour changer de type de régime."
            hasArrow
            placement="auto-start"
          >
            <span>
              <Checkbox
                size={'lg'}
                fontWeight={'bold'}
                colorScheme={'orange'}
                isDisabled
                isChecked={isSpecialMeal}
              >
                Régime sans gluten/lactose
              </Checkbox>
            </span>
          </Tooltip>

          <ConfirmationUpdateMealsModal
            mealsData={mealsData}
            setRefreshing={setRefreshing}
            isDisabled={isMealDataUpdated}
          />
        </VStack>
      </Stack>
      <form>
        <HStack m={4} spacing={8} margin={4} justifyContent={'center'}>
          <Heading size={'md'}>Désinscription aux repas par période</Heading>
        </HStack>
        <Stack
          m={4}
          spacing={{ base: 2, md: 8 }}
          margin={4}
          marginBlockEnd={8}
          justifyContent={'center'}
          direction={{ base: 'column', md: 'row' }}
        >
          <Box>
            <Text>Du</Text>

            <Input
              id="inputStartDate"
              type="date"
              onChange={e => startDateChange(dayjs(e.target.value))}
              title="Date de début"
              placeholder="Date de début'"
            >
            </Input>
          </Box>
          <Box>
            <Text>Au</Text>
            <Input
              id="endDate"
              type="date"
              onChange={e => startEndChange(dayjs(e.target.value))}
              title="Date de fin"
              placeholder="Date de fin"
            >
            </Input>
          </Box>

          {O.isSome(customerId) ?
            (
              <Box alignSelf={'self-end'}>
                <ConfirmationUpdateMealsByPeriodModal
                  setRefreshing={setRefreshing}
                  startDate={startDate}
                  endDate={endDate}
                  reservationId={customerId.value} // TODO tmp to test without reservation id
                  setDate={setDate}
                />
              </Box>
            ) :
            null}
        </Stack>
      </form>
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

  let table = pipe(mealsData.map(meals => meals.regularLunch), A.map(O.fromNullable), A.compact)

  const totalRegularLunch: number = totalMeals(table)

  table = pipe(mealsData.map(meals => meals.regularDinner), A.map(O.fromNullable), A.compact)
  const totalRegularDinner: number = totalMeals(table)

  // specialLunch: calculation of total.

  table = pipe(mealsData.map(meals => meals.specialLunch), A.map(O.fromNullable), A.compact)
  const totalSpecialLunch: number = totalMeals(table)

  // specialDinner: calculation of total.

  table = pipe(mealsData.map(meals => meals.specialDinner), A.map(O.fromNullable), A.compact)
  const totalSpecialDinner: number = totalMeals(table)

  const totalRegular: number = totalRegularDinner + totalRegularLunch
  const totalSpecial: number = totalSpecialDinner + totalSpecialLunch
  const total: number = totalRegular + totalSpecial

  // breakfast: calculation of total .

  table = pipe(mealsData.map(meals => meals.breakfast), A.map(O.fromNullable), A.compact)
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
