// import { useAppDispatch, useAppSelector } from 'app/config/store'
// import React, { useEffect } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reacttrap'

// import { deleteEntity, getEntity } from './reservation.reducer'

// export const ReservationDeleteDialog = () => {
//   const dispatch = useAppDispatch()
//   const { id } = useParams<{ id: string }>()
//   const navigate = useNavigate()
//   useEffect(() => {
//     dispatch(getEntity(id))
//   }, [])

//   const reservationEntity = useAppSelector(state => state.reservation.entity)
//   const updateSuccess = useAppSelector(state => state.reservation.updateSuccess)

//   const handleClose = () => {
//     navigate('/reservation')
//   }

//   useEffect(() => {
//     if (updateSuccess) {
//       handleClose()
//     }
//   }, [updateSuccess])

//   const confirmDelete = () => {
//     dispatch(deleteEntity(reservationEntity.id))
//   }

//   return (
//     <Modal isOpen toggle={handleClose}>
//       <ModalHeader toggle={handleClose} data-cy="reservationDeleteDialogHeading">
//         Confirmer l&apos;opération de suppression
//       </ModalHeader>
//       <ModalBody id="gestionhebergementApp.reservation.delete.question">
//         Êtes-vous sûr de vouloir supprimer cette réservation ?
//       </ModalBody>
//       <ModalFooter>
//         <Button color="secondary" onClick={handleClose}>
//           <FontAwesomeIcon icon="ban" />
//           &nbsp; Retour
//         </Button>
//         <Button
//           id="jhi-confirm-delete-reservation"
//           data-cy="entityConfirmDeleteButton"
//           color="danger"
//           onClick={confirmDelete}
//         >
//           <FontAwesomeIcon icon={faTrash} />
//           &nbsp; Supprimer
//         </Button>
//       </ModalFooter>
//     </Modal>
//   )
// }
