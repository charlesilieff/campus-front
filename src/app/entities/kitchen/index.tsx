import { Box, Button, HStack, Input } from '@chakra-ui/react'
import type { IMeal } from 'app/shared/model/meal.model'
import axios from 'axios'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { FaCalendar } from 'react-icons/fa'

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

  // On calcule le nombre de jours du mois de la date passée par l'utilisateur.
  // Si c'est égal à 31 on ne veut pas afficher le deuxiéme mois.
  const totalDays = date.daysInMonth()

  const getMealsDateFor31Days = async (startDate: Dayjs) => {
    const requestUrl = `${apiUrlMealsDateFor31Days}/${startDate.format('YYYY-MM-DD')}?cacheBuster=${
      new Date().getTime()
    }`
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
      comment: mealsNumber.comment
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
      setNumberOfDays(15)
    } else {
      setNumberOfDays(31)
    }
  }

  return (
    <MealsContext.Provider value={[mealsData, changeMeal]}>
      <Box m={4}>
        <HStack m={4} spacing={8}>
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
      <div className="col-4">
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

  const result: number[] = [
    totalRegularLunch,
    totalRegularDinner,
    totalSpecialLunch,
    totalSpecialDinner,
    totalRegular,
    totalSpecial,
    total
  ]

  return result
}
