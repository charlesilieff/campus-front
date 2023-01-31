import { CheckCircleIcon, EditIcon } from '@chakra-ui/icons'
import { Button, Text, VStack } from '@chakra-ui/react'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { FaTimesCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'

import type { IReservationsPlanning } from '../../shared/model/reservationsPlanning.model'

interface IProps {
  reservation: IReservationsPlanning
}
const ReservationModal = ({ reservation }: IProps) => {
  const [modal, setModal] = useState(false)
  const toggle = () => setModal(!modal)
  return (
    <>
      <Button
        backgroundColor={'transparent'}
        onClick={toggle}
        leftIcon={<EditIcon />}
        _hover={{ textDecoration: 'none', color: 'black' }}
        _active={{ textDecoration: 'none', color: 'black' }}
        rightIcon={reservation?.isConfirmed ?
          <CheckCircleIcon color="green" /> :
          <FaTimesCircle color="red" />}
        px={2}
        py={4}
      >
        <VStack>
          <Text fontSize={14}>{reservation?.customer.firstname}</Text>{' '}
          <Text fontSize={14}>{reservation?.customer.lastname}</Text>
        </VStack>
      </Button>
      <Modal isOpen={modal} toggle={toggle} className="modal-l">
        <ModalHeader toggle={toggle}>
          {reservation?.customer.lastname} {reservation?.customer.firstname}
        </ModalHeader>
        <ModalBody>
          <div>Date d&apos;arrivée : {dayjs(reservation?.arrivalDate).format('DD/MM/YYYY')}</div>
          <div>Date de départ : {dayjs(reservation?.departureDate).format('DD/MM/YYYY')}</div>
          <div>Nombre de personnes : {reservation?.personNumber}</div>
          <div>Réservation payée : {reservation?.isPaid ? 'Oui' : 'Non'}</div>
          <div>Réservation confirmée : {reservation?.isConfirmed ? 'Oui' : 'Non'}</div>
          <div>Email de contact : {reservation?.customer.email}</div>
          <Link to={`/bookingbeds/${reservation?.id}`} className="alert-link">
            Détails de la réservation
          </Link>
        </ModalBody>
      </Modal>
    </>
  )
}

export default ReservationModal
