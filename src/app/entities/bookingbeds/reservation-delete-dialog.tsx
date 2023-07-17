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
import { useAppDispatch } from 'app/config/store'
import { Effect as T } from 'effect'
import { pipe } from 'effect'
import type { FunctionComponent } from 'react'
import React from 'react'
import { FaBan, FaTrash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

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

    // Version effectify with T.gen (équivalent defer dans scala ZIO) :
    await pipe(
      T.gen(function* (_) {
        const response = yield* _(T.promise(() =>
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
      T.runPromise
    )

    // Version effectify with map and pipe :

    //
    // await pipe(
    //   T.attemptPromise(() =>
    //     dispatch(
    //       deleteEntity({ id: reservationId, sendMail: true })
    //     )
    //   ),
    //   T.map(response => response.meta.requestStatus),
    //   T.flatMap(requestStatus => requestStatus === 'fulfilled' ? T.unit() : T.fail('ko')),
    //   T.map(() =>
    //     toast({
    //       position: 'top',
    //       title: 'Réservation supprimée !',
    //       description: 'La réservation a bien été supprimée.',
    //       status: 'success',
    //       duration: 4000,
    //       isClosable: true
    //     })
    //   ),
    //   T.map(() => dispatch(reset())),
    //   T.map(() => navigate('/planning')),
    //   T.catchAll(() =>
    //     T.succeed(toast({
    //       position: 'top',
    //       title: 'Erreur !',
    //       description: "La réservation n'a pas pu être supprimée.",
    //       status: 'error',
    //       duration: 4000,
    //       isClosable: true
    //     }))
    //   ),
    //   T.map(() => onClose()),
    //   T.map(() => setIsDeleting(false)),
    //   T.runPromise
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
