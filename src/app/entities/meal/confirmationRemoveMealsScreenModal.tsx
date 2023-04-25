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
// import type dayjs from 'dayjs'
import type { FunctionComponent } from 'react'
import React, { useState } from 'react'
import { FaBan, FaSave, FaTrash } from 'react-icons/fa'

export const ConfirmationRemoveMealsScreenModal: FunctionComponent<
  {
    mealsData: IMeal[]
    date: Dayjs
    numberOfDays: number
    setDate: (date: Dayjs) => void
    setRefreshing: (refreshing: boolean) => void
  }
> = (
  { mealsData, date, numberOfDays, setDate, setRefreshing }
): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false)

  const apiUrlUpdateMeal = 'api/meals/update'
  const toast = useToast()

  /**
   * select and update meals of planning on screen
   */
  const updateMealsOnPeriod = async (entity: IMeal[], date: Dayjs, numberOfDays: number) => {
    entity = entity.filter((value, index) => {
      if (index < (numberOfDays)) {
        return value
      }
    }).map((value, index) => {
      if (index < numberOfDays) {
        value = {
          ...value,
          specialLunch: 0,
          specialDinner: 0,
          regularLunch: 0,
          regularDinner: 0,
          comment: mealsData[index].comment,
          breakfast: 0
        }
      }
      return value
    })

    await axios.put<IMeal>(
      apiUrlUpdateMeal,
      entity.filter(x => x.id !== undefined)
    )

    setIsLoading(false)
    // TODO : refresh screen + add toast
    setDate(date)
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
        isLoading={isLoading}
        leftIcon={<FaSave />}
        colorScheme={'green'}
        _hover={{
          textDecoration: 'none',
          color: 'green.200',
          backgroundColor: '#38A169'
        }}
        size={{ base: 'sm', md: 'md' }}
      >
        Se désinscrire sur la période affichée
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Confirmer la mise à jour
          </ModalHeader>
          <ModalBody>
            Êtes-vous sûr de vouloir vous désinscrire des repas sur la période affichée sur
            l&apos;écran ?
          </ModalBody>
          <ModalFooter justifyContent={'space-between'}>
            <Button onClick={onClose} leftIcon={<FaBan />} variant="back" isLoading={isLoading}>
              Retour
            </Button>
            <Button
              onClick={() =>
                updateMealsOnPeriod(mealsData, date, numberOfDays).then(() => {
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
