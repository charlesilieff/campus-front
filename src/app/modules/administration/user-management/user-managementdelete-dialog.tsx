import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react'
import { useAppDispatch } from 'app/config/store'
import type { FunctionComponent } from 'react'
import React, { useEffect } from 'react'
import { FaBan, FaTrash } from 'react-icons/fa'

import { deleteUser, getUser } from './user-management.reducer'

export const UserManagementDeleteDialog: FunctionComponent<{ login: string }> = (
  { login }
): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getUser(login))
  }, [])

  const confirmDelete = (login: string) => {
    dispatch(deleteUser(login))
    onClose()
  }

  return (
    <>
      <Button
        size="sm"
        variant="danger"
        onClick={onOpen}
        leftIcon={<FaTrash />}
        borderLeftRadius={0}
      >
        Supprimer
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmation de suppression</ModalHeader>
          <ModalBody>
            Etes-vous certain de vouloir supprimer l&apos;utilisateur {login} ?
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Button variant={'back'} onClick={onClose} leftIcon={<FaBan />}>
                Annuler
              </Button>
              <Button
                variant="danger"
                onClick={_ => confirmDelete(login)}
                leftIcon={<FaTrash />}
              >
                Supprimer
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
