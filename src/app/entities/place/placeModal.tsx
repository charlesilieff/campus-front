import { Button } from '@chakra-ui/react'
import type { IPlace } from 'app/shared/model/place.model'
import React, { useState } from 'react'
import { BsMap } from 'react-icons/bs'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'

const PlaceModal = (place: IPlace) => {
  const [modal, setModal] = useState(false)

  const toggle = () => setModal(!modal)
  return (
    <div>
      {place.image ?
        (
          <Button
            color={'white'}
            style={{ backgroundColor: '#3182CE', borderStyle: 'none', marginRight: '2rem' }}
            onClick={toggle}
            leftIcon={<BsMap />}
          >
            Plan
          </Button>
        ) :
        <p>Pas de plan pour ce lieu.</p>}
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
  )
}

export default PlaceModal
