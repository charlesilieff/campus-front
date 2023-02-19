import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

import { deleteEntity, getEntity } from './room.reducer'

export const RoomDeleteDialog = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<'id'>()
  useEffect(() => {
    dispatch(getEntity(id))
  }, [])
  const navigate = useNavigate()
  const roomEntity = useAppSelector(state => state.room.entity)
  const updateSuccess = useAppSelector(state => state.room.updateSuccess)
  const errorMessage = useAppSelector(state => state.room.errorMessage)
  const [showError, setShowError] = useState(false)
  const handleClose = () => {
    navigate('/room')
  }

  useEffect(() => {
    if (updateSuccess) {
      handleClose()
    }
  }, [updateSuccess])

  useEffect(() => {
    if (errorMessage) {
      setShowError(true)
    }
  }, [errorMessage])

  const confirmDelete = () => {
    dispatch(deleteEntity(roomEntity.id))
  }

  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose} data-cy="roomDeleteDialogHeading">
        Confirmer l&apos;opération de suppression
      </ModalHeader>
      <ModalBody id="gestionhebergementApp.room.delete.question">
        Êtes-vous sûr de vouloir supprimer cette chambre ?
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp; Retour
        </Button>
        <Button
          id="jhi-confirm-delete-room"
          data-cy="entityConfirmDeleteButton"
          color="danger"
          onClick={confirmDelete}
        >
          <FontAwesomeIcon icon={faTrash} />
          &nbsp; Supprimer
        </Button>
      </ModalFooter>
      <p style={{ marginLeft: '2em', color: 'red' }}>
        <b>{showError && errorMessage}</b>
      </p>
    </Modal>
  )
}
