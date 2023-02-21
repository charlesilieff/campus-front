import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  useDisclosure } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import type { FunctionComponent } from 'react'
import React, { useEffect } from 'react'
import { FaBan, FaTrash } from 'react-icons/fa'

import { deleteEntity } from './customer.reducer'

export const CustomerDeleteDialog: FunctionComponent<{ customerId: number }> = (
  { customerId }
): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const dispatch = useAppDispatch()

  const updateSuccess = useAppSelector(state => state.customer.updateSuccess)

  useEffect(() => {
    if (updateSuccess) {
      onClose()
    }
  }, [updateSuccess])

  const confirmDelete = () => {
    dispatch(deleteEntity(customerId))
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
          <ModalBody id="gestionhebergementApp.customer.delete.question">
            Êtes-vous sûr de vouloir supprimer ce client ?
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
