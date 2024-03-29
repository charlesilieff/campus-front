import { CheckCircleIcon, EditIcon, WarningIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure
} from '@chakra-ui/react'
import * as Match from '@effect/match'
import dayjs from 'dayjs'
import { pipe } from 'effect'
import React from 'react'
import { FaTimesCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import type {
  ReservationsPlanning,
  ReservationStatus
} from '../../shared/model/reservationsPlanning.model'

interface IProps {
  reservation: ReservationsPlanning
  isRespHebergement: boolean
}
export const ReservationModal = ({ reservation, isRespHebergement }: IProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const status = reservation.status
  const statusIcon = (status: ReservationStatus) =>
    pipe(
      status,
      Match.value,
      Match.when('pending', _ => <FaTimesCircle />),
      Match.when('processed', _ => <CheckCircleIcon />),
      Match.when('urgent', _ => <WarningIcon />),
      Match.exhaustive
    )

  return (
    <Box p={1}>
      <Button
        iconSpacing={1}
        maxW={'100%'}
        backgroundColor={'transparent'}
        onClick={onOpen}
        leftIcon={<EditIcon />}
        _hover={{ textDecoration: 'none', color: 'black' }}
        _active={{ textDecoration: 'none', color: 'black' }}
        rightIcon={isRespHebergement ? statusIcon(status) : <></>}
        px={2}
        py={4}
      >
        <Stack minW={'80%'}>
          <Text fontSize={14} isTruncated>{reservation.customer.firstName}</Text>
          <Text fontSize={14} isTruncated>{reservation.customer.lastName}</Text>
        </Stack>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader borderBottom={'solid'}>
            {reservation.customer.lastName} {reservation.customer.firstName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>Date d&apos;arrivée : {dayjs(reservation.arrivalDate).format('DD/MM/YYYY')}</div>
            <div>Date de départ : {dayjs(reservation.departureDate).format('DD/MM/YYYY')}</div>
            <div>Nombre de personnes : {reservation.personNumber}</div>
            <div>Réservation payée : {reservation.isPaid ? 'Oui' : 'Non'}</div>
            <div>Réservation confirmée : {reservation.isConfirmed ? 'Oui' : 'Non'}</div>
            <div>Email de contact : {reservation.customer.email}</div>
            <Link to={`/bookingbeds/${reservation.id}`} className="alert-link">
              Détails de la réservation
            </Link>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
