import { Button, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { Option as O } from 'effect'
import React, { useEffect } from 'react'
import { FaArrowLeft, FaPencilAlt } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { getCustomer } from './customer.reducer'

export const CustomerDetail = () => {
  const navigate = useNavigate()

  const dispatch = useAppDispatch()
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    if (id) {
      dispatch(getCustomer(id))
    }
  }, [])

  const customerEntity = useAppSelector(state => state.customer.entity)
  return (
    <>
      {O.isSome(customerEntity) ?
        (
          <VStack alignItems={'flex-start'}>
            <Heading>Client</Heading>

            <Heading size={'md'}>Prénom</Heading>

            <Text>{customerEntity.value.firstName}</Text>

            <Heading size={'md'}>Nom</Heading>

            <Text>{customerEntity.value.lastName}</Text>

            <Heading size={'md'}>Age</Heading>

            <Text>{O.getOrUndefined(customerEntity.value.age)}</Text>

            <Heading size={'md'}>Téléphone</Heading>

            <Text>{O.getOrUndefined(customerEntity.value.phoneNumber)}</Text>

            <Heading size={'md'}>Email</Heading>

            <Text>{customerEntity.value.email}</Text>

            <Heading size={'md'}>Comment</Heading>

            <Text>{O.getOrUndefined(customerEntity.value.comment)}</Text>
            <HStack>
              <Button
                as={Link}
                onClick={() => navigate(-1)}
                variant="back"
                leftIcon={<FaArrowLeft />}
              >
                Retour
              </Button>

              <Button
                as={Link}
                to={`/customer/${O.getOrUndefined(customerEntity.value.id)}/edit`}
                variant="modify"
                leftIcon={<FaPencilAlt />}
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
