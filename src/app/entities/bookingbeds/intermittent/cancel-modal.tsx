import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text
} from '@chakra-ui/react'
import React from 'react'
import { FaTrash } from 'react-icons/fa'

export const CancelReservationModal = (
  { cancelReservation, reservationId, isOpen, onOpen, onClose, isLoading }: {
    isLoading: boolean
    cancelReservation: (reservationId: number) => void
    reservationId: number
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
  }
): JSX.Element => (
  <>
    <Button
      isLoading={isLoading}
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
