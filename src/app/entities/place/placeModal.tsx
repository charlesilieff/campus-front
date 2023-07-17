import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay,
  useDisclosure } from '@chakra-ui/react'
import type { Place } from 'app/shared/model/place.model'
import { Option as O } from 'effect'
import React from 'react'
import { BsMap } from 'react-icons/bs'

export const PlaceModal = (place: Place) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box my={2}>
      {place.image ?
        (
          <Button
            color={'white'}
            style={{ backgroundColor: '#3182CE', borderStyle: 'none', marginRight: '2rem' }}
            onClick={onOpen}
            leftIcon={<BsMap />}
          >
            Plan
          </Button>
        ) :
        <Box>Pas de plan pour ce lieu.</Box>}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {`${place.name} ${place.comment}`}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {place.image && (
              <div>
                {O.isSome(place.imageContentType) && O.isSome(place.image) && (
                  <img
                    alt={place.name}
                    src={`data:${place.imageContentType.value};base64,${place.image.value}`}
                    style={{ maxHeight: '100%', maxWidth: '100%' }}
                  />
                )}
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
