import { Button, Heading, HStack, VStack } from '@chakra-ui/react'
import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { FaArrowLeft, FaPencilAlt } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'

import { getEntity } from './pricing.reducer'

export const PricingDetail = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<{ id: string }>()
  useEffect(() => {
    // @ts-expect-error TODO: fix this
    dispatch(getEntity(id))
  }, [])

  const pricingEntity = useAppSelector(state => state.pricing.entity)
  return (
    <>
      {O.isSome(pricingEntity) ?
        (
          <VStack alignItems={'flex-start'}>
            <Heading>Tarifs</Heading>
            <dl className="jh-entity-details">
              <dt>
                <Heading size={'md'}>Type reservation</Heading>
              </dt>
              <dd>
                {pipe(
                  pricingEntity.value.typeReservation,
                  O.map(p => p.name),
                  O.getOrElse(() => 'no data')
                )}
              </dd>
              <dt>
                <Heading size={'md'}>Catégorie utilisateur</Heading>
              </dt>
              <dd>
                {pipe(
                  pricingEntity.value.userCategory,
                  O.map(p => p.name),
                  O.getOrElse(() => 'no data')
                )}
              </dd>
              <dt>
                <Heading size={'md'}>Prix</Heading>
              </dt>
              <dd>{pricingEntity.value.price} €</dd>
              <dt>
                <Heading size={'md'}>Commentaire</Heading>
              </dt>
              <dd>{O.getOrNull(pricingEntity.value.comment)}</dd>
            </dl>
            <HStack>
              <Button as={Link} to="/pricing" leftIcon={<FaArrowLeft />} variant="back">
                Retour
              </Button>
              &nbsp;
              <Button
                as={Link}
                to={`/pricing/${pricingEntity.value.id}/edit`}
                leftIcon={<FaPencilAlt />}
                variant="modify"
              >
                Modifier
              </Button>
            </HStack>
          </VStack>
        ) :
        null}
    </>
  )
}
