import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

import { deleteEntity, getEntity } from './customer.reducer'

export const CustomerDeleteDialog = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getEntity(props.match.params.id))
  }, [])

  const customerEntity = useAppSelector(state => state.customer.entity)
  const updateSuccess = useAppSelector(state => state.customer.updateSuccess)

  const handleClose = () => {
    props.history.push('/customer')
  }

  useEffect(() => {
    if (updateSuccess) {
      handleClose()
    }
  }, [updateSuccess])

  const confirmDelete = () => {
    dispatch(deleteEntity(customerEntity.id))
  }

  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose} data-cy="customerDeleteDialogHeading">
        Confirmer l&apos;opération de suppression
      </ModalHeader>
      <ModalBody id="gestionhebergementApp.customer.delete.question">
        Êtes-vous sûr de vouloir supprimer ce client ?
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp; Retour
        </Button>
        <Button
          id="jhi-confirm-delete-customer"
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

export default CustomerDeleteDialog
