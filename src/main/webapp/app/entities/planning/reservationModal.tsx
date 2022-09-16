import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { IReservationsPlanning } from '../../shared/model/reservationsPlanning.model';
interface IProps {
  reservation: IReservationsPlanning;
}
const ReservationModal = ({ reservation }: IProps) => {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  return (
    <div>
      <Button color="green" onClick={toggle}>
        <FontAwesomeIcon icon="edit" size="1x" />
        &nbsp; {reservation?.customer.firstname} {reservation?.customer.lastname}
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
    </div>
  );
};

export default ReservationModal;
