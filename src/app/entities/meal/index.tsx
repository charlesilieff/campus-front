import { Box, Button, FormControl, FormLabel, Heading, HStack, Input, List, ListItem, Select, Stack,
  Table, Td, Text, Th, Tr, VStack } from '@chakra-ui/react'
import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getIntermittentReservations,
  getReservation } from 'app/entities/reservation/reservation.reducer'
import type { IMeal } from 'app/shared/model/meal.model'
import axios from 'axios'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { FaCalendar, FaCaretLeft, FaCaretRight } from 'react-icons/fa'

// import { IntermittentReservations } from '../bookingbeds/intermittent/reservations-list'
import { ConfirmationAddMealsScreenModal } from './confirmationAddMealsScreenModal'
import { ConfirmationRemoveMealsScreenModal } from './confirmationRemoveMealsScreenModal'
import { ConfirmationUpdateMealsByPeriodeModal } from './confirmationUpdateMealsByPeriodeModal'
import { ConfirmationUpdateMealsModal } from './confirmationUpdateMealsModal'
import { DisplayTotalMeals } from './displayTotalMeals'
import { MealsUserPlanning } from './mealsUserPlanning'

const apiUrlMealsDateFor31DaysByUser = 'api/meals'
// const apiUrlUpdateMeal = 'api/meals/update'

export const Index = () => {
  const account = useAppSelector(state => state.authentication.account)

  const customerId = account.customerId
  // const customerId = pipe(
  //   account.customerId,
  //   O.fromNullable,
  //   O.map(Number)
  // )

  const [date, setDate] = useState(dayjs())
  const [startDate, setStartDate] = useState(dayjs())
  const [endDate, setEndDate] = useState(dayjs())
  const [mealsData, setMealsData] = useState([] as IMeal[])
  const [numberOfDays, setNumberOfDays] = useState(31)

  const [reservationId, setReservationId] = useState<number>(0)
  /**
   * Get Reservations by user.
   */

  const dispatch = useAppDispatch()

  const userId = pipe(
    account.id,
    O.fromNullable,
    O.map(Number)
  )
  console.log('userId', userId)

  const reservationList = useAppSelector(state => state.reservation.entities).filter(x =>
    dayjs(dayjs(x?.departureDate)).isAfter(
      date.subtract(1, 'day').format('YYYY-MM-DD'),
      'day'
    )
  ).filter(x =>
    dayjs(dayjs(x?.arrivalDate)).isBefore(
      date.format('YYYY-MM-DD'),
      'day'
    )
  ) // .filter(x => x.beds?.length > 0)
  console.log('reservationList :', reservationList)
  // reservationList

  const reservationListFirst = reservationList[0]
  // if (reservationList.length > 1) {
  //   setReservationId(reservationListFirst.id)

  // }

  // // console.log('reservationListFirst', reservationListFirst)
  // // const reservationListFirstId = reservationList[0].id
  // // console.log('reservationListFirstId', reservationListFirstId)

  useEffect(() => {
    if (O.isSome(userId)) dispatch(getIntermittentReservations(userId.value))
    if (reservationList.length > 0) dispatch(getReservation(reservationList[0].id))

    // setReservationId(reservationListFirst.id)
    // MealsUserPlanning
    // setDate(date)
    // dispatch(MealsUserPlanning())
  }, [])

  // const handleSyncList = () => {
  //   if (O.isSome(userId)) dispatch(getIntermittentReservations(userId.value))
  // }

  /**
   * Get meals for 31 days by user. //todo getMealsDateFor31DaysByUser by reservation
   */
  useEffect(() => {
    const getMealsDateFor31DaysByUser = async (startDate: Dayjs, customerId: number) => {
      const requestUrl = `${apiUrlMealsDateFor31DaysByUser}/customer-id/${customerId}/date/${
        startDate.format('YYYY-MM-DD')
      }`
      const { data } = await axios.get<IMeal[]>(requestUrl)
      console.log('data axios', data)
      // const dataSorted = data.sort((a, b) => (a > b.date ? 1 : -1))
      setMealsData(data)
    }
    getMealsDateFor31DaysByUser(date, customerId)
  }, [date])
  /**
   * Get meals for 31 days by reservation. //todo getMealsDateFor31DaysByUser by reservation
   */
  useEffect(() => {
    const getMealsDateFor31DaysByReservation = async (startDate: Dayjs, reservationId: number) => {
      const requestUrl = `${apiUrlMealsDateFor31DaysByUser}/reservation-id/${reservationId}/date/${
        startDate.format('YYYY-MM-DD')
      }`
      const { data } = await axios.get<IMeal[]>(requestUrl)

      // const dataSorted = data.sort((a, b) => (a > b.date ? 1 : -1))
      // TODO stand-by setMealsData(data)
    }
    getMealsDateFor31DaysByReservation(date, reservationId)
  }, [reservationId, date])

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
    console.log('date', date)
    // TODO check if it's necessarry to load new data (if calendar is showing 7 days)
    setDate(date.add(1, 'day'))
    if (O.isSome(userId)) dispatch(getIntermittentReservations(userId.value))
    dispatch(getReservation(reservationList[0].id))
    setReservationId(reservationListFirst.id)
    if (reservationList.length > 0) {
      console.log('erreur plusieurs réservation', reservationList.length)
    }
  }
  const toggleSubtractDays = () => {
    console.log('date', date)
    setDate(date.subtract(1, 'day'))
    if (O.isSome(userId)) dispatch(getIntermittentReservations(userId.value))
    // reservationList[0]
  }

  // console.log('reservationId :', reservationId)
  // console.log('reservationListFirst ', reservationListFirst)
  // setReservationId(reservationListFirst.id)

  // console.log('reservationListFirst  id', O.getOrElse(reservationListFirst.id, () => '0'))
  // console.log('reservationListFirst id', reservationListFirst.id)

  return (
    <>
      <Box m={4}>
        {/* todo  */}
        {
          /* <HStack m={4} spacing={8} margin={4} marginBlockEnd={12} alignItems={'flex-start'}>

          <FormControl isRequired isInvalid={reservationId === 0}>
            <Stack>
              <Heading alignSelf={'flex-start'}>Ma reservation :</Heading>
            </Stack>
            <HStack>
              <Select
                id="reservationId"
                title="Mes réservations"
                onChange={e => setReservationId(+e.target.value)}
                // defaultValue={reservationListFirst ? reservationListFirst.id : null}

                // placeholder="Sélectionner une réservation"
                // {...register('userCategoryId', {})}
                // defaultValue={reservationList ? reservationList[1].id : null}
                // defaultValue={reservationListFirst ? reservationListFirst.id : null}
                // defaultValue={reservationListFirstId ? reservationListFirstId : null}
                // defaultValue={reservationListFirst.id}
              >
                {reservationList ?
                  reservationList.map(reservation => (
                    <option
                      value={reservation.id}
                      key={reservation.id}
                      // accessKey={reservationListFirst.id}
                    >
                      {reservation.id}
                    </option>
                  )) :
                  null}
              </Select>
              <Table>
                <Tr borderBottom={'solid'}>
                  <Th>Id</Th>
                  <Th>Date d&apos;arrivée</Th>
                  <Th>Date de départ</Th>

                  <Th>Nombre de personne</Th>
                  <Th>Commentaire</Th>
                </Tr>
                {reservationList ?
                  reservationList.map((reservation, index) => (
                    <Tr key={index}>
                      <Td>
                        {reservation.id}
                      </Td>
                      <Td>
                        {reservation.arrivalDate.toString()}
                      </Td>
                      <Td>
                        {reservation.departureDate.toString()}
                      </Td>
                      <Td>
                        {reservation.personNumber}
                      </Td>
                      <Td>
                        {reservation.comment}
                      </Td>
                    </Tr>
                  )) :
                  null}
              </Table>
            </HStack>
          </FormControl>
        </HStack> */
        }
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
          <Box alignSelf={'end'}>
            <ConfirmationUpdateMealsByPeriodeModal
              startDate={startDate}
              endDate={endDate}
              reservationId={reservationId}
              setDate={setDate}
            />
          </Box>
        </HStack>

        <HStack m={4} spacing={8}>
          <Heading alignSelf={'flex-start'}>Mes repas réservés</Heading>
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
              onChange={e => setDate(dayjs(e.target.value))} // todo getMealsDateFor31DaysByUser
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
