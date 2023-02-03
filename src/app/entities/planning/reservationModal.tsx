import { CheckCircleIcon, EditIcon, WarningIcon } from '@chakra-ui/icons'
import { Box, Button, HStack, Text } from '@chakra-ui/react'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { FaTimesCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'

import type { IReservationsPlanning,
  ReservationStatus } from '../../shared/model/reservationsPlanning.model'

interface IProps {
  reservation: IReservationsPlanning
  isRespHebergement: boolean
}
export const ReservationModal = ({ reservation, isRespHebergement }: IProps) => {
  const [modal, setModal] = useState(false)
  const status = reservation.status
  const statusIcon = (status: ReservationStatus) => {
    switch (status) {
      case 'pending':
        return <FaTimesCircle />
      case 'processed':
        return <CheckCircleIcon />
      case 'urgent':
        return <WarningIcon />
      default:
        return null
    }
  }

  console.log('status', status)
  const toggle = () => setModal(!modal)
  return (
    <Box>
      <Button
        backgroundColor={'transparent'}
        onClick={toggle}
        leftIcon={<EditIcon />}
        _hover={{ textDecoration: 'none', color: 'black' }}
        _active={{ textDecoration: 'none', color: 'black' }}
        rightIcon={isRespHebergement ? statusIcon(status) : null}
        px={2}
        py={4}
      >
        <HStack>
          <Text fontSize={14}>{reservation?.customer.firstname}</Text>
          <Text fontSize={14}>{reservation?.customer.lastname}</Text>
        </HStack>
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
    </Box>
  )
}
