import { Box, Button, Heading, HStack, Input } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import type { IMeal } from 'app/shared/model/meal.model'
import type { IUpdateMeal } from 'app/shared/model/updateMeal.model'
import axios from 'axios'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { FaCalendar } from 'react-icons/fa'
import { FaSave } from 'react-icons/fa'

import type { IMealsNumber } from './IMealsNumber'
import { MealsContext } from './mealsContext'
import { MealsPlanning } from './mealsUserPlanning'

const apiUrlMealsDateFor31DaysByUser = 'api/meals/customer-id/'
const apiUrlUpdateMeal = 'api/meals/update'
interface IShowSavingProps {
  isShow: boolean
  message: string
}

export const Index2 = () => {
  const account = useAppSelector(state => state.authentication.account)

  const customerId = account.customerId

  const [date, setDate] = useState(dayjs())

  const [mealsData, setMealsData] = useState([] as IMeal[])

  const defaultSavingPopupProps: IShowSavingProps = { isShow: false, message: '' }
  const [showSavingPopup, setShowSavingPopup] = useState(defaultSavingPopupProps)
  const [numberOfDays, setNumberOfDays] = useState(31 as number)

  // useEffect(() => {
  //   if (O.isSome(userId)) dispatch(getIntermittentReservations(userId.value))
  // }, [])

  // const handleSyncList = () => {
  //   if (O.isSome(userId)) dispatch(getIntermittentReservations(userId.value))
  // }

  useEffect(() => {
    getMealsDateFor31DaysByUser(date, customerId)
  }, [date, customerId])

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

  // On calcule le nombre de jours du mois de la date passée par l'utilisateur.
  // Si c'est égal à 31 on ne veut pas afficher le deuxiéme mois.
  const totalDays = date.daysInMonth()
  // async () => {
  //   const requestUrl = `${apiUrl}?cacheBuster=${new Date().getTime()}`
  //   return axios.get<ICustomer[]>(requestUrl)
  // }
  const getMealsDateFor31DaysByUser = async (startDate: Dayjs, customerId: number) => {
    const requestUrl = `${apiUrlMealsDateFor31DaysByUser}/${customerId}/date/${
      startDate.format('YYYY-MM-DD')
    }?cacheBuster=${new Date().getTime()}`
    const { data } = await axios.get<IMeal[]>(requestUrl)
    console.log('data', data)
    setMealsData(data)
  }

  // const transformResultDayNull = (result: IMeal[]) => {
  //   For (let i = 0; i < 31; i++) {

  // const resultDayNull = result.map((value, index) => {
  //   if (value === 0) {
  //     return 1

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
    console.log('setMealsData', newDefaultValue)
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
      setNumberOfDays(15)
    } else {
      setNumberOfDays(31)
    }
  }

  // const updating = useAppSelector(state => state.meal.updating)
  // const updateSuccess = useAppSelector(state => state.meal.updateSuccess)

  // const navigate = useNavigate()
  // const handleClose = () => {
  //   navigate('/meals-planning')
  // }
  // useEffect(() => {
  //   if (updateSuccess) {
  //     handleClose()
  //   }
  // }, [updateSuccess])

  // const dispatch = useAppDispatch()
  // const updateMeals = (values: IMeal) => {
  //   const entity: IMeal = {
  //     ...values
  //   }
  //   dispatch(updateEntity(entity))
  // }

  const updateMeals = (entity: IMeal[]) => {
    // const result = axios.put<IMeal>(`${apiUrl}/${entity.id}`, cleanEntity({ ...entity }))
    console.log('entity', entity)
    console.log('entity2', entity.filter(value => value.id !== 0))
    console.log('entity3', entity.filter(value => value.id !== 0).flatMap(x => x))
    const result = axios.post<IMeal>(apiUrlUpdateMeal, entity.filter(value => value.id !== 0))
    // const result = axios.put<IUpdateMeal>(
    //   `${apiUrlUpdateMeal}/${entity.filter(value => value.id !== 0).flatMap(x => x)}`
    // )

    return result
  }

  return (
    <MealsContext.Provider value={[mealsData, changeMeal]}>
      <Box m={4}>
        <HStack m={4} spacing={8}>
          <Heading alignSelf={'flex-start'}>Mes repas réservés</Heading>
          <Box>
            <Input
              type="date"
              onChange={newDatePlanning}
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

        <MealsPlanning date={date} totalDays={totalDays} numberOfDays={numberOfDays} />
        <Button
          type="submit"
          onClick={() => updateMeals(mealsData)}
          // isLoading={updating}
          leftIcon={<FaSave />}
          variant={'update'}
        >
          Modifier
        </Button>
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
  return (
    <div className="row">
      <div className="col-5">
        <div id="total" className="col">
          {`Total de mes petits-déjeuner: ${resultTotalMeals[7]}`}
        </div>
        <div id="total" className="col">
          {`Total repas classiques de midi: ${resultTotalMeals[0]}`}
        </div>
        <div id="total" className="col">
          {`Total repas classiques du soir: ${resultTotalMeals[1]}`}
        </div>
        <div id="total" className="col">
          {`Total repas spéciaux de midi: ${resultTotalMeals[2]}`}
        </div>
        <div id="total" className="col">
          {`Total repas spéciaux du soir: ${resultTotalMeals[3]}`}
        </div>
      </div>
      <div className="col-4">
        <div id="total" className="col">
          <br />
        </div>
        <div id="total" className="col">
          {`Total repas classiques: ${resultTotalMeals[4]}`}
        </div>
        <div id="total" className="col">
          <br />
        </div>
        <div id="total" className="col">
          {`Total repas spéciaux: ${resultTotalMeals[5]}`}
        </div>
      </div>
      <div className="col-4">
        <div id="total" className="col">
          <br />
        </div>
        <div id="total" className="col">
          <br />
        </div>
        <div id="total" className="col">
          <br />
          {' '}
        </div>
        <div id="total" className="col">
          {`Total repas: ${resultTotalMeals[6]}`}
        </div>
      </div>
    </div>
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
