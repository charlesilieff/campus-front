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
import type { FunctionComponent } from 'react'
import React, { useState } from 'react'
import { FaBan, FaSave, FaTrash } from 'react-icons/fa'

export const ConfirmationUpdateMealsModal: FunctionComponent<{ mealsData: IMeal[] }> = (
  { mealsData }
): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false)

  const apiUrlUpdateMeal = 'api/meals/update'
  /**
   * update meals with checkbox
   */
  const updateMeals = async (entity: IMeal[]) => {
    setIsLoading(true)
    await axios.put<IMeal>(
      apiUrlUpdateMeal,
      entity.filter(value => value.id !== undefined)
    )
    setIsLoading(false)
    onClose()
  }

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button
        onClick={onOpen}
        isLoading={isLoading}
        leftIcon={<FaSave />}
        variant={'update'}
      >
        Modifier
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
              onClick={() => updateMeals(mealsData)}
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
