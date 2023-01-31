import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IMeal } from 'app/shared/model/meal.model'
import axios from 'axios'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { ValidatedField } from 'react-jhipster'
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap'

import type { IMealsNumber } from './IMealsNumber'
import MealContext from './mealsContext'
import MealsPlanning from './mealsPlanning'

const apiUrlMealsDateFor31Daus = 'api/meals/date'
interface IShowSavingProps {
  isShow: boolean
  message: string
}

const Index = () => {
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

  const newDatePlanning = (dateStart: any) => {
    setDate(dayjs(dateStart.target.value))
  }

  // On calcule le nombre de jours du mois de la date passée par l'utilisateur.
  // Si c'est égal à 31 on ne veut pas afficher le deuxiéme mois.
  const totalDays = date.daysInMonth()

  const getMealsDateFor31Days = async (startDate: Dayjs) => {
    const requestUrl = `${apiUrlMealsDateFor31Daus}/${startDate.format('YYYY-MM-DD')}?cacheBuster=${
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
      specialLunchToCook: mealsNumber.lunchtime.specialDiet,
      specialDinnerToCook: mealsNumber.dinner.specialDiet,
      regularLunchToCook: mealsNumber.lunchtime.classicDiet,
      regularDinnerToCook: mealsNumber.dinner.classicDiet,
      comment: mealsNumber.comment
    }
    // Mise à jour du contexte : du nombre de repas à réaliser.
    setMealsData([...newDefaultValue])
  }

  /**
   * Calculation of total.
   */
  const totalMeals = (table: number[]) => {
    const add = (accumulator, a) => accumulator + a
    return table.reduce(add, 0) // with initial value to avoid when the array is empty
  }

  let resultTotalMeals: number[]
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
    <MealContext.Provider value={[mealsData, changeMeal]}>
      <div>
        <div>
          <ValidatedField
            className="inline-block"
            id="date"
            name="date"
            data-cy="date"
            type="date"
            onChange={newDatePlanning}
          >
          </ValidatedField>
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;

          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;

          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          {/* sur 15 jours */}
          <Button
            color="primary"
            id="number-of-days"
            data-cy="numberofday"
            onClick={() => toggleNumberOfDays()}
          >
            <FontAwesomeIcon icon="calendar" />
            &nbsp; {numberOfDays === 31 ? '15 jours' : '31 jours'}
          </Button>
        </div>

        <MealsPlanning date={date} totalDays={totalDays} numberOfDays={numberOfDays} />
      </div>
      {displayTotalMeals(resultTotalMeals)}

      {showSavingPopup.isShow && savePopupFunction(showSavingPopup.message)}
    </MealContext.Provider>
  )
}
export default Index

function calculateAccordingToNumberOfDays(
  mealsDataDays: IMeal[],
  numberOfDays: number,
  mealsData: IMeal[],
  resultTotalMeals: number[],
  totalMeals: (table: number[]) => any
) {
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
          {'Total repas classiques du soir: ' + resultTotalMeals[1]}
        </div>
        <div id="total" className="col">
          {'Total repas spéciaux de midi: ' + resultTotalMeals[2]}
        </div>
        <div id="total" className="col">
          {'Total repas spéciaux du soir: ' + resultTotalMeals[3]}
        </div>
      </div>
      <div className="col-4">
        <div id="total" className="col">
          <br />
        </div>
        <div id="total" className="col">
          {'Total repas classiques: ' + resultTotalMeals[4]}
        </div>
        <div id="total" className="col">
          <br />
        </div>
        <div id="total" className="col">
          {'Total repas spéciaux: ' + resultTotalMeals[5]}
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
          {'Total repas: ' + resultTotalMeals[6]}
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
function totalMealsCalculation(mealsData: IMeal[], totalMeals: (table: number[]) => any) {
  // regularLunchToCook: calculation of total.
  let table: number[] = mealsData.map(meals => meals.regularLunchToCook)
  const totalRegularLunchToCook: number = totalMeals(table)

  table = mealsData.map(meals => meals.regularDinnerToCook)
  const totalRegularDinnerToCook: number = totalMeals(table)

  // specialLunchToCook: calculation of total.
  table = mealsData.map(meals => meals.specialLunchToCook)
  const totalSpecialLunchToCook: number = totalMeals(table)

  // specialDinnerToCook: calculation of total.
  table = mealsData.map(meals => meals.specialDinnerToCook)
  const totalSpecialDinnerToCook: number = totalMeals(table)

  const totalRegularToCook: number = totalRegularDinnerToCook + totalRegularLunchToCook
  const totalSpecialToCook: number = totalSpecialDinnerToCook + totalSpecialLunchToCook
  const totalToCook: number = totalRegularToCook + totalSpecialToCook

  const result: number[] = [
    totalRegularLunchToCook,
    totalRegularDinnerToCook,
    totalSpecialLunchToCook,
    totalSpecialDinnerToCook,
    totalRegularToCook,
    totalSpecialToCook,
    totalToCook
  ]

  return result
}

/**
 * Comment modal box.
 * @param modal
 * @param toggle
 * @param date
 * @param submitModalPopup
 * @param commentPopup
 * @param changeCommentPopup
 * @returns
 */
function savePopupFunction(commentPopup: string) {
  return (
    <Modal isOpen={true}>
      <ModalHeader>Sauvegarde:</ModalHeader>
      <ModalBody>
        <label>{commentPopup}</label>
      </ModalBody>
    </Modal>
  )
}
