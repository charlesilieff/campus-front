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
import { Option as O } from 'effect'
import type { FunctionComponent } from 'react'
import React, { useState } from 'react'
import { FaBan, FaSave, FaTrash } from 'react-icons/fa'

const apiUrlMealsDateFor31DaysByUser = 'api/meals'

export const ConfirmationUpdateMealsByPeriodModal: FunctionComponent<
  {
    startDate: O.Option<Dayjs>
    endDate: O.Option<Dayjs>
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
    if (startDate.isAfter(endDate) || startDate.isBefore(dayjs())) {
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

    const mealsDataBetweenDateUpdate = mealsDataBetweenDate.map((value, index) => ({
      ...value,
      specialLunch: 0,
      specialDinner: 0,
      regularLunch: 0,
      regularDinner: 0,
      comment: mealsDataBetweenDate[index].comment,
      breakfast: 0
    }))

    await axios.put<IMeal>(
      apiUrlUpdateMeal,
      mealsDataBetweenDateUpdate
    )

    setIsLoading(false)
    O.isSome(startDate) && setDate(startDate.value)

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
        leftIcon={<FaSave />}
        colorScheme={'green'}
        isDisabled={!(O.isSome(startDate) && O.isSome(endDate)
          && startDate.value.isBefore(endDate.value)
          && startDate.value.isAfter(dayjs().subtract(1, 'day')))}
        _hover={{
          textDecoration: 'none',
          color: 'green.200',
          backgroundColor: '#38A169'
        }}
        size={{ base: 'sm', md: 'md' }}
      >
        Confirmer
      </Button>
      {O.isSome(startDate) && O.isSome(endDate) ?
        (
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                Confirmer la mise à jour
              </ModalHeader>
              <ModalBody>
                Êtes-vous sûr de vouloir modifier vos repas du{' '}
                {startDate.value.format('DD/MM/YYYY')} au {endDate.value.format('DD/MM/YYYY')} ?
              </ModalBody>
              <ModalFooter justifyContent={'space-between'}>
                <Button onClick={onClose} leftIcon={<FaBan />} variant="back" isLoading={isLoading}>
                  Retour
                </Button>
                <Button
                  onClick={() =>
                    updateMealsFromDate(startDate.value, endDate.value, reservationId).then(() => {
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
        ) :
        null}
    </>
  )
}
