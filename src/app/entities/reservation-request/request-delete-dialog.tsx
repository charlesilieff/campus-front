import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

import { deleteEntity, getEntity } from './reservation-request.reducer'

export const RequestDeleteDialog = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<'id'>()
  const navigate = useNavigate()
  useEffect(() => {
    dispatch(getEntity(id))
  }, [])

  const updateSuccess = useAppSelector(state => state.requestReservation.updateSuccess)

  const handleClose = () => {
    navigate(`/reservation-request/${id}`)
  }

  const confirmDelete = () => {
    dispatch(deleteEntity(id))
  }

  return !updateSuccess ?
    (
      <Modal isOpen toggle={handleClose}>
        <ModalHeader toggle={handleClose} data-cy="customerDeleteDialogHeading">
          Confirmation de l&apos;annulation de la réservation.
        </ModalHeader>
        <ModalBody id="gestionhebergementApp.customer.delete.question">
          Voulez-vraiment annuler la demande de réservation ?
        </ModalBody>
        <ModalFooter>
          <Button data-cy="entityDetailsBackButton" color="secondary" onClick={handleClose}>
            <FontAwesomeIcon icon="ban" />
            &nbsp; Non
          </Button>
          <Button
            id="jhi-confirm-delete-customer"
            data-cy="entityConfirmDeleteButton"
            color="danger"
            onClick={confirmDelete}
          >
            <FontAwesomeIcon icon="trash" />
            &nbsp; Oui
          </Button>
        </ModalFooter>
      </Modal>
    ) :
    <div>Votre réservation a bien été annulée, vous allez recevoir un email de confirmation.</div>
}

export default RequestDeleteDialog
