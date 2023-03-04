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
import { useAppDispatch } from 'app/config/store'
import type { FunctionComponent } from 'react'
import React from 'react'
import { FaBan, FaTrash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

import { deleteEntity, reset } from './reservation-request.reducer'

export const ReservationRequestDeleteDialog: FunctionComponent<{ reservationRequestId: string }> = (
  { reservationRequestId }
): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const toast = useToast()

  const confirmDelete = async () => {
    await dispatch(deleteEntity(reservationRequestId))
    toast({
      position: 'top',
      title: 'Réservation annulée',
      description: 'La demande de réservation a bien été annulée.',
      status: 'success',
      duration: 4000,
      isClosable: true
    })
    dispatch(reset())
    navigate('/reservation-request/new')
  }

  return (
    <>
      <Button
        variant="danger"
        onClick={onOpen}
        leftIcon={<FaTrash />}
      >
        Annuler
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Confirmation de l&apos;annulation de la réservation.
          </ModalHeader>
          <ModalBody id="gestionhebergementApp.reservation-request.delete.question">
            Voulez-vraiment annuler la demande de réservation ?
          </ModalBody>
          <ModalFooter justifyContent={'space-between'}>
            <Button onClick={onClose} leftIcon={<FaBan />} variant="back">
              Non
            </Button>
            <Button
              onClick={confirmDelete}
              leftIcon={<FaTrash />}
              variant="danger"
            >
              Oui
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
