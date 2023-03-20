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
import { useNavigate } from 'react-router'

import { deleteEntity, reset } from './booking-beds.reducer'

export const ReservationDeleteDialog: FunctionComponent<{ reservationId: number }> = (
  { reservationId }
): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isDeleting, setIsDeleting] = React.useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const toast = useToast()

  const confirmDelete = async () => {
    setIsDeleting(true)
    const { meta: { requestStatus } } = await dispatch(
      deleteEntity({ id: reservationId, sendMail: true })
    )

    if (requestStatus === 'fulfilled') {
      toast({
        position: 'top',
        title: 'Réservation supprimée !',
        description: 'La réservation a bien été supprimée.',
        status: 'success',
        duration: 4000,
        isClosable: true
      })
      dispatch(reset())

      navigate('/planning')
    }

    if (requestStatus === 'rejected') {
      toast({
        position: 'top',
        title: 'Erreur !',
        description: "La réservation n'a pas pu être supprimée.",
        status: 'error',
        duration: 4000,
        isClosable: true
      })
    }
    onClose()

    setIsDeleting(false)
  }

  return (
    <>
      <Button
        variant="danger"
        onClick={onOpen}
        leftIcon={<FaTrash />}
      >
        Supprimer
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Confirmer l&apos;opération de suppression
          </ModalHeader>
          <ModalBody id="gestionhebergementApp.reservation.delete.question">
            Êtes-vous sûr de vouloir supprimer cette réservation ?
          </ModalBody>
          <ModalFooter justifyContent={'space-between'}>
            <Button onClick={onClose} leftIcon={<FaBan />} variant="back">
              Retour
            </Button>
            <Button
              onClick={confirmDelete}
              leftIcon={<FaTrash />}
              variant="danger"
              isLoading={isDeleting}
            >
              Supprimer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
