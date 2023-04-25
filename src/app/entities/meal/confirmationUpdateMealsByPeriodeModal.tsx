import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import type { IMeal } from 'app/shared/model/meal.model'
import axios from 'axios'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import type { FunctionComponent } from 'react'
import React, { useState } from 'react'
import { FaBan, FaSave, FaTrash } from 'react-icons/fa'

const apiUrlMealsDateFor31DaysByUser = 'api/meals'

export const ConfirmationUpdateMealsByPeriodModal: FunctionComponent<
  {
    startDate: Dayjs
    endDate: Dayjs
    reservationId: number
    setDate: (date: Dayjs) => void
    setRefreshing: (refreshing: boolean) => void
  }
> = (
  { startDate, endDate, reservationId, setDate, setRefreshing }
): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false)
  const apiUrlUpdateMeal = 'api/meals/update'
  const toast = useToast()

  /**
   * update meals betwwen 2 date
   */
  /* todo change : create a updateMealsBetweenTwoDateByReservation */
  const updateMealsFromDate = async (
    startDate: Dayjs,
    endDate: Dayjs,
    reservationId: number
  ) => {
    if (startDate > endDate || startDate < dayjs()) {
      // TODO : add toast and check startDate < date
      toast({
        position: 'top',
        title: 'Erreur !',
        description:
          "La date de début doit être inférieure à la date de fin et supérieur à aujourd'hui.",
        status: 'error',
        duration: 4000,
        isClosable: true
      })
      return
    }
    // const requestUrl = `${apiUrlMealsDateFor31DaysByUser}/reservation-id/${reservationId}/date1/${
    const requestUrl = `${apiUrlMealsDateFor31DaysByUser}/customer-id/${reservationId}/date1/${
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

    await axios.put<IMeal>(
      apiUrlUpdateMeal,
      mealsDataBetweenDateUpdate
    )

    setIsLoading(false)
    setDate(startDate)

    toast({
      position: 'top',
      title: 'Repas modifiés !',
      description: 'A bientôt !',
      status: 'success',
      duration: 9000,
      isClosable: true
    })

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
        size={{ base: 'sm', md: 'md' }}
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
            Êtes-vous sûr de vouloir modifier vos repas du {startDate.format('DD/MM/YYYY')} au{' '}
            {endDate.format('DD/MM/YYYY')} ?
          </ModalBody>
          <ModalFooter justifyContent={'space-between'}>
            <Button onClick={onClose} leftIcon={<FaBan />} variant="back" isLoading={isLoading}>
              Retour
            </Button>
            <Button
              onClick={() =>
                updateMealsFromDate(startDate, endDate, reservationId).then(() => {
                  setRefreshing(true)
                })}
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
