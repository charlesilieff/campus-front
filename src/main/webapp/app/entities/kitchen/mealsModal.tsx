import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { IReservationsPlanning } from '../../shared/model/reservationsPlanning.model';

const MealsModal = () => {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  return (
    <div>
      <Button color="green" onClick={toggle}></Button>
      <Modal isOpen={modal} toggle={toggle} className="modal-l">
        <ModalHeader toggle={toggle}>Commentaire</ModalHeader>
        <ModalBody>
          {/* <div>Date : {dayjs(reservation?.arrivalDate).format('DD/MM/YYYY')}</div> */}
          <div>
            Commentaire : Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto incidunt iste culpa consequatur, praesentium
            fugiat magni eligendi vero, fugit autem distinctio provident optio eum, sint officiis reiciendis ad. Blanditiis quidem
            voluptates earum ipsa reiciendis obcaecati placeat nisi! Voluptatibus, atque unde. Quo animi impedit, nulla sit esse ipsa minima
            iusto vel dolor eum accusamus voluptate non atque dicta temporibus eaque recusandae?
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default MealsModal;
