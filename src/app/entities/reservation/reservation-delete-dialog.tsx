import React, { useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useAppDispatch, useAppSelector } from 'app/config/store'
import { deleteEntity, getEntity } from './reservation.reducer'

export const ReservationDeleteDialog = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getEntity(props.match.params.id))
  }, [])

  const reservationEntity = useAppSelector(state => state.reservation.entity)
  const updateSuccess = useAppSelector(state => state.reservation.updateSuccess)

  const handleClose = () => {
    props.history.push('/reservation')
  }

  useEffect(() => {
    if (updateSuccess) {
      handleClose()
    }
  }, [updateSuccess])

  const confirmDelete = () => {
    dispatch(deleteEntity(reservationEntity.id))
  }

  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose} data-cy="reservationDeleteDialogHeading">
        Confirmer l&apos;opération de suppression
      </ModalHeader>
      <ModalBody id="gestionhebergementApp.reservation.delete.question">
        Êtes-vous sûr de vouloir supprimer cette réservation ?
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp; Retour
        </Button>
        <Button
          id="jhi-confirm-delete-reservation"
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

export default ReservationDeleteDialog
