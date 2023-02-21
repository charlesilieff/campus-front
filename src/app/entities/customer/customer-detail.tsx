import { Button, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { FaArrowLeft, FaPencilAlt } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'

import { getEntity } from './customer.reducer'

export const CustomerDetail = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    dispatch(getEntity(id))
  }, [])

  const customerEntity = useAppSelector(state => state.customer.entity)
  return (
    <VStack alignItems={'flex-start'}>
      <Heading>Customer</Heading>

      <Heading size={'md'}>Prénom</Heading>

      <Text>{customerEntity.firstname}</Text>

      <Heading size={'md'}>Nom</Heading>

      <Text>{customerEntity.lastname}</Text>

      <Heading size={'md'}>Age</Heading>

      <Text>{customerEntity.age}</Text>

      <Heading size={'md'}>Téléphone</Heading>

      <Text>{customerEntity.phoneNumber}</Text>

      <Heading size={'md'}>Email</Heading>

      <Text>{customerEntity.email}</Text>

      <Heading size={'md'}>Comment</Heading>

      <Text>{customerEntity.comment}</Text>
      <HStack>
        <Button as={Link} to="/customer" variant="back" leftIcon={<FaArrowLeft />}>
          Retour
        </Button>

        <Button
          as={Link}
          to={`/customer/${customerEntity.id}/edit`}
          variant="modify"
          leftIcon={<FaPencilAlt />}
        >
          Modifier
        </Button>
      </HStack>
    </VStack>
  )
}
