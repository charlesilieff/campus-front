import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ICustomer } from 'app/shared/model/customer.model'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

export const RGPDAnonymizeData = () => {
  const [isCustomersToAnonymize, setIsCustomersToAnonymize] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [customers, setCustomers] = useState([] as ICustomer[])
  const requestUrl = `/api/anonymizecustomers`

  const getIsCustomersToAnonymize = async () => {
    const { data } = await axios.get<ICustomer[]>(requestUrl)

    if (data.length !== 0) {
      setIsCustomersToAnonymize(true)

      setCustomers(
        data.map(c => ({
          ...c,
          firstname: 'anonyme',
          lastname: 'anonyme',
          age: 1,
          phoneNumber: '0000000000',
          email: `anonyme${c.id}@anonyme.fr`
        }))
      )
    }
  }

  const anonymizeCustomers = async () => {
    try {
      await axios.put<ICustomer[]>(requestUrl, customers)

      alert('Les données ont bien été anonymisées')
      setIsOpen(false)
    } catch (error) {
      alert(`Une erreur s'est produite : ${error}`)
      setIsOpen(false)
    }
  }

  useEffect(() => {
    getIsCustomersToAnonymize()
  }, [])

  return (
    <>
      <Modal isOpen={isOpen}>
        <ModalHeader toggle={() => setIsOpen(false)} data-cy="bedDeleteDialogHeading">
          Confirmer l&apos;opération.
        </ModalHeader>
        <ModalBody id="gestionhebergementApp.bed.delete.question">
          Êtes-vous sûr de vouloir anonymiser les données clients ?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setIsOpen(false)}>
            <FontAwesomeIcon icon="ban" />
            &nbsp; Retour
          </Button>
          <Button
            id="jhi-confirm-delete-bed"
            data-cy="entityConfirmDeleteButton"
            color="danger"
            onClick={() => anonymizeCustomers()}
          >
            <FontAwesomeIcon icon={faTrash} />
            &nbsp; Confirmer
          </Button>
        </ModalFooter>
      </Modal>

      {isCustomersToAnonymize ?
        (
          <Button
            id="delete-rgpd-data"
            data-cy="deleteLink"
            color="danger"
            onClick={() => setIsOpen(true)}
          >
            <FontAwesomeIcon icon={faTrash} />
            &nbsp; Anonymiser les données clients.
          </Button>
        ) :
        (
          <div>
            RGPD : Pas de données clients à anonymiser (derniére réservation antérieure à 3 ans).
          </div>
        )}
    </>
  )
}
