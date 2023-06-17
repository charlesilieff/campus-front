import { Button, HStack, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  useDisclosure } from '@chakra-ui/react'
import * as O from '@effect/data/Option'
import type { CustomerDecoded, CustomerEncoded } from 'app/shared/model/customer.model'
import { Customer } from 'app/shared/model/customer.model'
import { getHttpEntities } from 'app/shared/util/httpUtils'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaBan, FaTrash } from 'react-icons/fa'

export const RGPDAnonymizeData = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isCustomersToAnonymize, setIsCustomersToAnonymize] = useState(false)

  const [customers, setCustomers] = useState([] as CustomerDecoded[])
  const requestUrl = `/api/anonymizecustomers`

  const getIsCustomersToAnonymize = async () => {
    const data = await getHttpEntities(requestUrl, Customer)

    if (data.length !== 0) {
      setIsCustomersToAnonymize(true)

      setCustomers(
        data.map(c => ({
          ...c,
          firstname: 'anonyme',
          lastname: 'anonyme',
          age: O.none(),
          phoneNumber: O.none(),
          email: `anonyme${c.id}@anonyme.fr`
        }))
      )
    }
  }

  const anonymizeCustomers = async () => {
    try {
      await axios.put<CustomerEncoded[]>(requestUrl, customers)

      alert('Les données ont bien été anonymisées')
      onClose()
    } catch (error) {
      alert(`Une erreur s'est produite : ${error}`)
      onClose()
    }
  }

  useEffect(() => {
    getIsCustomersToAnonymize()
  }, [])

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Confirmer l&apos;opération.
          </ModalHeader>
          <ModalBody id="gestionhebergementApp.bed.delete.question">
            Êtes-vous sûr de vouloir anonymiser les données clients ?
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Button variant="back" onClick={onClose} leftIcon={<FaBan />}>
                Retour
              </Button>
              <Button
                variant="danger"
                onClick={anonymizeCustomers}
                leftIcon={<FaTrash />}
              >
                Confirmer
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {isCustomersToAnonymize ?
        (
          <Button
            variant="danger"
            onClick={onOpen}
            leftIcon={<FaTrash />}
          >
            Anonymiser les données clients.
          </Button>
        ) :
        (
          <div>
            RGPD : Pas de données clients à anonymiser (dernière réservation antérieure à 3 ans).
          </div>
        )}
    </>
  )
}
