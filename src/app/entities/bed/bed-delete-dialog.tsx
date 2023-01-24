import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

import { deleteEntity, getEntity } from './bed.reducer'

export const BedDeleteDialog = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<'id'>()
  const navigate = useNavigate()
  useEffect(() => {
    dispatch(getEntity(id))
  }, [])

  const bedEntity = useAppSelector(state => state.bed.entity)
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
    dispatch(deleteEntity(bedEntity.id))
  }

  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose} data-cy="bedDeleteDialogHeading">
        Confirmer l&apos;opération de suppression
      </ModalHeader>
      <ModalBody id="gestionhebergementApp.bed.delete.question">
        Êtes-vous sûr de vouloir supprimer cet lit ?
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp; Retour
        </Button>
        <Button
          id="jhi-confirm-delete-bed"
          data-cy="entityConfirmDeleteButton"
          color="danger"
          onClick={confirmDelete}
        >
          <FontAwesomeIcon icon="trash" />
          &nbsp; Supprimer
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default BedDeleteDialog
