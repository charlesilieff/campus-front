import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IPlace } from 'app/shared/model/place.model';
import React, { useState } from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';

const PlaceModal = (place: IPlace) => {
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);
  return (
    <div className="inline-block">
      {place.image ? (
        <Button size="sm" style={{ backgroundColor: '#B8D8BA', borderStyle: 'none', marginRight: '2rem' }} onClick={toggle}>
          <FontAwesomeIcon icon="map" />
          &nbsp;
          <span className="d-none d-md-inline">Plan</span>
        </Button>
      ) : (
        <p>Pas de plan pour ce lieu.</p>
      )}
      <Modal isOpen={modal} toggle={toggle} className="modal-xl">
        <ModalHeader toggle={toggle}>
          {place.name} {place.comment}
        </ModalHeader>
        <ModalBody>
          {place.image && (
            <div>
              {place.imageContentType && (
                <img
                  alt={place.name}
                  src={`data:${place.imageContentType};base64,${place.image}`}
                  style={{ maxHeight: '100%', maxWidth: '100%' }}
                />
              )}
            </div>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};

export default PlaceModal;
