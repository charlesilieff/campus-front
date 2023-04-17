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
// import type dayjs from 'dayjs'
import type { FunctionComponent } from 'react'
import React, { useState } from 'react'
import { FaBan, FaSave, FaTrash } from 'react-icons/fa'

export const ConfirmationRemoveMealsScreenModal: FunctionComponent<
  { mealsData: IMeal[]; date: Dayjs; numberOfDays: number; setDate: (date: Dayjs) => void }
> = (
  { mealsData, date, numberOfDays, setDate }
): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false)

  const apiUrlUpdateMeal = 'api/meals/update'

  /**
   * select and update meals of planning on screen
   */
  const updateMealsOnPeriode = async (entity: IMeal[], date: Dayjs, numberOfDays: number) => {
    entity = entity.filter((value, index) => {
      if (index < (numberOfDays)) {
        return value
      }
    }).map((value, index) => {
      // console.log('value', value)
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
    setDate(date.add(1, 'day'))

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
        // variant={'update'}
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
              onClick={() => updateMealsOnPeriode(mealsData, date, numberOfDays)}
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
