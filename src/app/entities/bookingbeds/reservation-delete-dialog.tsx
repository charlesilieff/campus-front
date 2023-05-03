import type {
  ButtonProps
} from '@chakra-ui/react'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { pipe } from '@effect/data/Function'
import * as Z from '@effect/io/Effect'
import { useAppDispatch } from 'app/config/store'
import type { FunctionComponent } from 'react'
import React from 'react'
import { FaBan, FaTrash } from 'react-icons/fa'
import { useNavigate } from 'react-router'

import { deleteEntity, reset } from './booking-beds.reducer'

export const ReservationDeleteDialog: FunctionComponent<
  {
    reservationId: number
    buttonProps?: ButtonProps
    backToPlanning?: boolean
    handleSyncList?: () => void
  }
> = (
  { reservationId, buttonProps, backToPlanning = true, handleSyncList }
): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isDeleting, setIsDeleting] = React.useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const toast = useToast()

  const confirmDelete = async () => {
    setIsDeleting(true)

    // Version effectify with Z.gen (équivalent defer dans scala ZIO) :
    await pipe(
      Z.gen(function* (_) {
        const response = yield* _(Z.promise(() =>
          dispatch(
            deleteEntity({ id: reservationId, sendMail: true })
          )
        ))
        const requestStatus = response.meta.requestStatus

        if (requestStatus === 'fulfilled') {
          toast({
            position: 'top',
            title: 'Réservation supprimée !',
            description: 'La réservation a bien été supprimée.',
            status: 'success',
            duration: 4000,
            isClosable: true
          })
          dispatch(reset())
          if (backToPlanning) {
            navigate('/planning')
          }
          if (handleSyncList) {
            handleSyncList()
          }
        }

        if (requestStatus === 'rejected') {
          toast({
            position: 'top',
            title: 'Erreur !',
            description: "La réservation n'a pas pu être supprimée.",
            status: 'error',
            duration: 4000,
            isClosable: true
          })
        }
        onClose()

        setIsDeleting(false)
      }),
      Z.runPromise
    )

    // Version effectify with map and pipe :

    //
    // await pipe(
    //   Z.attemptPromise(() =>
    //     dispatch(
    //       deleteEntity({ id: reservationId, sendMail: true })
    //     )
    //   ),
    //   Z.map(response => response.meta.requestStatus),
    //   Z.flatMap(requestStatus => requestStatus === 'fulfilled' ? Z.unit() : Z.fail('ko')),
    //   Z.map(() =>
    //     toast({
    //       position: 'top',
    //       title: 'Réservation supprimée !',
    //       description: 'La réservation a bien été supprimée.',
    //       status: 'success',
    //       duration: 4000,
    //       isClosable: true
    //     })
    //   ),
    //   Z.map(() => dispatch(reset())),
    //   Z.map(() => navigate('/planning')),
    //   Z.catchAll(() =>
    //     Z.succeed(toast({
    //       position: 'top',
    //       title: 'Erreur !',
    //       description: "La réservation n'a pas pu être supprimée.",
    //       status: 'error',
    //       duration: 4000,
    //       isClosable: true
    //     }))
    //   ),
    //   Z.map(() => onClose()),
    //   Z.map(() => setIsDeleting(false)),
    //   Z.runPromise
    // )

    // Version async await javascript classique :

    // const {meta:{requestStatus}} = await dispatch(deleteEntity({ id: reservationId, sendMail: true }))
    // if (requestStatus === 'fulfilled') {
    //   toast({
    //     position: 'top',
    //     title: 'Réservation supprimée !',
    //     description: 'La réservation a bien été supprimée.',
    //     status: 'success',
    //     duration: 4000,
    //     isClosable: true
    //   })
    //   dispatch(reset())

    //   navigate('/planning')
    // }

    // if (requestStatus === 'rejected') {
    //   toast({
    //     position: 'top',
    //     title: 'Erreur !',
    //     description: "La réservation n'a pas pu être supprimée.",
    //     status: 'error',
    //     duration: 4000,
    //     isClosable: true
    //   })
    // }
    // onClose()

    // setIsDeleting(false)

    // version oldschool :
    // dispatch(deleteEntity({ id: reservationId, sendMail: true })).then(
    //   ({ meta: { requestStatus } }) => {
    //     if (requestStatus === 'fulfilled') {
    //       toast({
    //         position: 'top',
    //         title: 'Réservation supprimée !',
    //         description: 'La réservation a bien été supprimée.',
    //         status: 'success',
    //         duration: 4000,
    //         isClosable: true
    //       })
    //       dispatch(reset())

    //       navigate('/planning')
    //     }

    //     if (requestStatus === 'rejected') {
    //       toast({
    //         position: 'top',
    //         title: 'Erreur !',
    //         description: "La réservation n'a pas pu être supprimée.",
    //         status: 'error',
    //         duration: 4000,
    //         isClosable: true
    //       })
    //     }
    //     onClose()

    //     setIsDeleting(false)
    //   }
    // )
  }

  return (
    <>
      <Button
        variant="danger"
        onClick={onOpen}
        leftIcon={<FaTrash />}
        {...buttonProps}
      >
        Supprimer
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Confirmer l&apos;opération de suppression
          </ModalHeader>
          <ModalBody id="gestionhebergementApp.reservation.delete.question">
            Êtes-vous sûr de vouloir supprimer cette réservation ?
          </ModalBody>
          <ModalFooter justifyContent={'space-between'}>
            <Button onClick={onClose} leftIcon={<FaBan />} variant="back">
              Retour
            </Button>
            <Button
              onClick={confirmDelete}
              leftIcon={<FaTrash />}
              variant="danger"
              isLoading={isDeleting}
            >
              Supprimer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
