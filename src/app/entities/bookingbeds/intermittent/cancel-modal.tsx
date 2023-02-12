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
  useDisclosure
} from '@chakra-ui/react'
import { useAppDispatch } from 'app/config/store'
import { deleteEntity } from 'app/entities/bookingbeds/booking-beds.reducer'
import type { getIntermittentReservations } from 'app/entities/reservation/reservation.reducer'
import { Option as O, pipe } from 'effect'
import React, { useState } from 'react'
import { FaTrash } from 'react-icons/fa'

export const CancelReservationModal = (
  { reservationId, userId, getReservations }: {
    userId: O.Option<number>
    reservationId: number
    getReservations: typeof getIntermittentReservations
  }
): JSX.Element => {
  const dispatch = useAppDispatch()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isDeleting, setIsDeleting] = useState(false)
  const cancelReservation = (id: number) => {
    setIsDeleting(true)
    dispatch(deleteEntity(id)).then(() => {
      setIsDeleting(false)
      pipe(userId, O.map(userId => dispatch(getReservations(userId))))
    })
    onClose()
  }
  return (
    <>
      <Button
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
