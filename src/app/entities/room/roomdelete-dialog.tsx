import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  useDisclosure } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import type { FunctionComponent } from 'react'
import React, { useEffect } from 'react'
import { FaBan, FaTrash } from 'react-icons/fa'

import { deleteEntity } from './room.reducer'

export const RoomDeleteDialog: FunctionComponent<{ roomId: number }> = (
  { roomId }
): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const dispatch = useAppDispatch()

  const updateSuccess = useAppSelector(state => state.room.updateSuccess)

  useEffect(() => {
    if (updateSuccess) {
      onClose()
    }
  }, [updateSuccess])

  const confirmDelete = () => {
    dispatch(deleteEntity(roomId))
  }

  return (
    <>
      <Button
        size="sm"
        variant="danger"
        onClick={onOpen}
        leftIcon={<FaTrash />}
        borderLeftRadius={0}
      >
        Supprimer
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Confirmer l&apos;opération de suppression
          </ModalHeader>
          <ModalBody>
            Êtes-vous sûr de vouloir supprimer ce tarif ?
          </ModalBody>
          <ModalFooter justifyContent={'space-between'}>
            <Button onClick={onClose} leftIcon={<FaBan />} variant="back">
              Retour
            </Button>
            <Button
              onClick={confirmDelete}
              leftIcon={<FaTrash />}
              variant="danger"
            >
              Supprimer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
