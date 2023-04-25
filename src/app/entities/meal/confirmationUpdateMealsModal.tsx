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
import type { FunctionComponent } from 'react'
import React, { useState } from 'react'
import { FaBan, FaSave } from 'react-icons/fa'

export const ConfirmationUpdateMealsModal: FunctionComponent<
  { mealsData: IMeal[]; setRefreshing: (refreshing: boolean) => void }
> = (
  { mealsData, setRefreshing }
): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false)

  const apiUrlUpdateMeal = 'api/meals/update'
  const toast = useToast()
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
    toast({
      position: 'top',
      title: 'Repas modifiés ! (sauf dans le passé)',
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
        // variant={'update'}
      >
        Modifier les repas tels que sélectionnés
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Confirmer la mise à jour
          </ModalHeader>
          <ModalBody>
            Êtes-vous sûr de vouloir modifier vos repas tels que sélectionnés sur l&apos;écran ?
          </ModalBody>
          <ModalFooter justifyContent={'space-between'}>
            <Button onClick={onClose} leftIcon={<FaBan />} variant="back" isLoading={isLoading}>
              Retour
            </Button>
            <Button
              onClick={() =>
                updateMeals(mealsData).then(() => {
                  setRefreshing(true)
                })}
              leftIcon={<FaSave />}
              colorScheme={'green'}
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
