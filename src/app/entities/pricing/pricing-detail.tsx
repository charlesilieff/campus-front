import { Button, Heading, HStack, VStack } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { FaArrowLeft, FaPencilAlt } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'

import { getEntity } from './pricing.reducer'

export const PricingDetail = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<{ id: string }>()
  useEffect(() => {
    dispatch(getEntity(id))
  }, [])

  const pricingEntity = useAppSelector(state => state.pricing.entity)
  return (
    <VStack alignItems={'flex-start'}>
      <Heading>Tarifs</Heading>
      <dl className="jh-entity-details">
        <dt>
          <Heading size={'md'}>Prix</Heading>
        </dt>
        <dd>{pricingEntity.price} €</dd>
        <dt>
          <Heading size={'md'}>Commentaire</Heading>
        </dt>
        <dd>{pricingEntity.comment}</dd>
        <dt>
          <Heading size={'md'}>Type reservation</Heading>
        </dt>
        <dd>{pricingEntity.typeReservation ? pricingEntity.typeReservation.name : 'no data'}</dd>
        <dt>
          <Heading size={'md'}>Categorie utilisateur</Heading>
          {
            /* <Button
            as={Link}
            to={`/pricing/${pricingEntity.id}/edit`}
            leftIcon={<FaPencilAlt />}
            variant="modify"
          >
            Ajouter un type de réservation
          </Button> */
          }
        </dt>
        <dd>{pricingEntity.userCategory ? pricingEntity.userCategory.name : 'no data'}</dd>
        {/* <dd>{pricingEntity.userCategory.name}</dd> */}
      </dl>
      <HStack>
        <Button as={Link} to="/pricing" leftIcon={<FaArrowLeft />} variant="back">
          Retour
        </Button>
        &nbsp;
        <Button
          as={Link}
          to={`/pricing/${pricingEntity.id}/edit`}
          leftIcon={<FaPencilAlt />}
          variant="modify"
        >
          Modifier
        </Button>
      </HStack>
    </VStack>
  )
}
