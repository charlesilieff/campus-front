import React, { useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useAppDispatch, useAppSelector } from 'app/config/store'
import { deleteEntity, getEntity } from './pricing.reducer'

export const PricingDeleteDialog = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getEntity(props.match.params.id))
  }, [])

  const pricingEntity = useAppSelector(state => state.pricing.entity)
  const updateSuccess = useAppSelector(state => state.pricing.updateSuccess)

  const handleClose = () => {
    props.history.push('/pricing')
  }

  useEffect(() => {
    if (updateSuccess) {
      handleClose()
    }
  }, [updateSuccess])

  const confirmDelete = () => {
    dispatch(deleteEntity(pricingEntity.id))
  }

  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose} data-cy="pricingDeleteDialogHeading">
        Confirmer l&apos;opération de suppression
      </ModalHeader>
      <ModalBody id="gestionhebergementApp.pricing.delete.question">
        Êtes-vous sûr de vouloir supprimer ce tarif ?
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp; Retour
        </Button>
        <Button
          id="jhi-confirm-delete-pricing"
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

export default PricingDeleteDialog
