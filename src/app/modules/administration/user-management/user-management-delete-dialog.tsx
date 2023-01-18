import React, { useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useAppDispatch, useAppSelector } from 'app/config/store'
import { deleteUser, getUser } from './user-management.reducer'

export const UserManagementDeleteDialog = (props: RouteComponentProps<{ login: string }>) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getUser(props.match.params.login))
  }, [])

  const handleClose = event => {
    event.stopPropagation()
    props.history.push('/admin/user-management')
  }

  const user = useAppSelector(state => state.userManagement.user)

  const confirmDelete = event => {
    dispatch(deleteUser(user.login))
    handleClose(event)
  }

  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>Confirmer l&apos;opération de suppression</ModalHeader>
      <ModalBody>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp; Retour
        </Button>
        <Button color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp; Supprimer
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default UserManagementDeleteDialog
