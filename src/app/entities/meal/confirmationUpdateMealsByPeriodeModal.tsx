import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react'
import type { IMeal } from 'app/shared/model/meal.model'
import axios from 'axios'
import type { Dayjs } from 'dayjs'
import type { FunctionComponent } from 'react'
import React, { useState } from 'react'
import { FaBan, FaSave, FaTrash } from 'react-icons/fa'

const apiUrlMealsDateFor31DaysByUser = 'api/meals/customer-id'

export const ConfirmationUpdateMealsByPeriodeModal: FunctionComponent<
  { startDate: Dayjs; endDate: Dayjs; customerId: number; setDate: (date: Dayjs) => void }
> = (
  { startDate, endDate, customerId, setDate }
): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false)
  const apiUrlUpdateMeal = 'api/meals/update'

  /**
   * update meals betwwen 2 date
   */
  /* todo change : create a updateMealsBetweenTwoDateByUser */
  const updateMealsFromDate = async (
    startDate: Dayjs,
    endDate: Dayjs,
    customerId: number
  ) => {
    const requestUrl = `${apiUrlMealsDateFor31DaysByUser}/${customerId}/date1/${
      startDate.format('YYYY-MM-DD')
    }/date2/${endDate.format('YYYY-MM-DD')}`
    // await axios.get<IMeal[]>(requestUrl)
    const { data } = await axios.get<IMeal[]>(requestUrl)
    // console.log('data axios', data)
    updateMealsFromDate2(data)
  }

  const updateMealsFromDate2 = async (
    mealsDataBetweenDate: IMeal[]
  ) => {
    setIsLoading(true)

    const mealsDataBetweenDateUpdate = mealsDataBetweenDate.map((value, index) => {
      value = {
        ...value,
        specialLunch: 0,
        specialDinner: 0,
        regularLunch: 0,
        regularDinner: 0,
        comment: mealsDataBetweenDate[index].comment,
        breakfast: 0
      }
      return value
    })

    // console.log('mealsDataBetweenDateUpdate', mealsDataBetweenDateUpdate)

    await axios.put<IMeal>(
      apiUrlUpdateMeal,
      mealsDataBetweenDateUpdate
    )

    setIsLoading(false)
    setDate(startDate)

    onClose()
  }

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button
        onClick={onOpen}
        // onClick={() => updateMealsFromDate()} // , startDate, endDate, checkboxTwoDate
        leftIcon={<FaSave />}
        colorScheme={'green'}
        _hover={{
          textDecoration: 'none',
          color: 'green.200',
          backgroundColor: '#38A169'
        }}
      >
        Se désinscrire sur la période sélectionnée
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Confirmer la mise à jour
          </ModalHeader>
          <ModalBody>
            Êtes-vous sûr de vouloir modifier vos repas ?
          </ModalBody>
          <ModalFooter justifyContent={'space-between'}>
            <Button onClick={onClose} leftIcon={<FaBan />} variant="back" isLoading={isLoading}>
              Retour
            </Button>
            <Button
              onClick={() => updateMealsFromDate(startDate, endDate, customerId)}
              leftIcon={<FaTrash />}
              variant="danger"
              isLoading={isLoading}
            >
              Confirmer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
