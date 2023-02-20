import { Button, Modal, ModalBody, ModalFooter, ModalHeader, useDisclosure } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import type { FunctionComponent } from 'react'
import React, { useEffect } from 'react'
import { FaBan, FaTrash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

// import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { deleteEntity } from './bed.reducer'

export const BedDeleteDialog: FunctionComponent<{ bedId: number }> = (bedId): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  const updateSuccess = useAppSelector(state => state.bed.updateSuccess)

  const handleClose = () => {
    navigate('/bed')
  }

  useEffect(() => {
    if (updateSuccess) {
      handleClose()
    }
  }, [updateSuccess])

  const confirmDelete = () => {
    dispatch(deleteEntity(bedId.bedId))
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
        <ModalHeader>
          Confirmer l&apos;opération de suppression
        </ModalHeader>
        <ModalBody id="gestionhebergementApp.bed.delete.question">
          Êtes-vous sûr de vouloir supprimer cet lit ?
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleClose} leftIcon={<FaBan />} variant="back">
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
      </Modal>
    </>
  )
}
