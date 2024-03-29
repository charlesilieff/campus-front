import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { useAppDispatch } from 'app/config/store'
import { deleteEntity } from 'app/entities/bookingbeds/booking-beds.reducer'
import React, { useState } from 'react'
import { FaTrash } from 'react-icons/fa'

export const CancelReservationModal = (
  { reservationId, getReservations }: {
    reservationId: number
    getReservations: () => void
  }
): JSX.Element => {
  const toast = useToast()
  const dispatch = useAppDispatch()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isDeleting, setIsDeleting] = useState(false)
  const cancelReservation = async (id: number) => {
    setIsDeleting(true)
    await dispatch(deleteEntity({ id, sendMail: false }))
    toast({
      position: 'top',
      title: 'Réservation supprimée !',
      description: 'La réservation a bien été supprimée.',
      status: 'success',
      duration: 4000,
      isClosable: true
    })
    setIsDeleting(false)
    getReservations()

    onClose()
  }
  return (
    <>
      <Button
        size="sm"
        isLoading={isDeleting}
        color="white"
        backgroundColor={'#df382c'}
        borderRightRadius={0}
        leftIcon={<FaTrash />}
        onClick={onOpen}
      >
        Annuler
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Annulation de la réservation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Êtes-vous sûr de vouloir annuler votre réservation ?</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Fermer
            </Button>
            <Button
              color="white"
              backgroundColor={'#df382c'}
              onClick={() => cancelReservation(reservationId)}
            >
              Oui
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
