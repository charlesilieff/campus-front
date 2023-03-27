import { Button, Heading, HStack, VStack } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { FaArrowLeft, FaPencilAlt } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'

import { getEntity } from './type-reservation.reducer'

export const TypeReservationDetail = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<{ id: string }>()
  useEffect(() => {
    dispatch(getEntity(id))
  }, [])

  const typeReservationEntity = useAppSelector(state => state.typeReservation.entity)
  return (
    <VStack alignItems={'flex-start'}>
      <Heading>Type de réservation</Heading>
      <dl className="jh-entity-details">
        <dt>
          <Heading size={'md'}>Nom</Heading>
        </dt>
        <dd>{typeReservationEntity.name} €</dd>
        <dt>
          <Heading size={'md'}>Commentaire</Heading>
        </dt>
        <dd>
          {typeReservationEntity.comment ? typeReservationEntity.comment : 'pas de commentaire'}
        </dd>
      </dl>
      <HStack>
        <Button as={Link} to="/pricing" leftIcon={<FaArrowLeft />} variant="back">
          Retour
        </Button>
        &nbsp;
        <Button
          as={Link}
          to={`/type-reservation/${typeReservationEntity.id}/edit`}
          leftIcon={<FaPencilAlt />}
          variant="modify"
        >
          Modifier
        </Button>
      </HStack>
    </VStack>
  )
}
