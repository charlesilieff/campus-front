import { CheckCircleIcon } from '@chakra-ui/icons'
import {
  Button,
  Heading,
  HStack,
  Text,
  VStack
} from '@chakra-ui/react'
import * as O from '@effect/data/Option'
import React from 'react'
import { BsPencil } from 'react-icons/bs'

import type { Customer } from './reservation-intermittent-update'

interface CustomerSummaryProps {
  customer: Customer
  setUpdateCustomer: (updateCustomer: boolean) => void
}

export const CustomerSummary = (
  {
    customer: {
      age,
      email,
      firstname,
      lastname,
      phoneNumber
    },
    setUpdateCustomer
  }: CustomerSummaryProps
): JSX.Element => {
  const phoneNumberString = O.getOrElse(phoneNumber, () => 'Pas de téléphone renseigné')
  return (
    <VStack
      alignItems={'flex-start'}
      border={'solid'}
      p={4}
      borderRadius={8}
      borderColor={'#D9D9D9'}
      my={4}
    >
      <HStack>
        <Heading size={'lg'} marginBottom={4}>
          Informations personnelles <CheckCircleIcon color={'green'}></CheckCircleIcon>
        </Heading>
      </HStack>

      <HStack py={2}>
        <Text fontWeight={'bold'}>{'Nom :'}</Text>
        <Text>{firstname}</Text>
        <Text pl={12} fontWeight={'bold'}>{'Prénom :'}</Text>
        <Text>{lastname}</Text>
      </HStack>
      <VStack alignItems={'flex-start'} py={2}>
        {O.isSome(age) ?
          (
            <HStack py={2}>
              <Text fontWeight={'bold'}>{'Age :'}</Text>
              {age.value ?
                (
                  <>
                    <Text>{age.value}</Text>
                    <Text>{' '}ans</Text>
                  </>
                ) :
                <Text>Non renseigné</Text>}
            </HStack>
          ) :
          (
            <HStack py={2}>
              <Text fontWeight={'bold'}>{'Age :'}</Text>
              <Text>{'Non renseigé'}</Text>
            </HStack>
          )}
      </VStack>
      <HStack py={2}>
        <Text fontWeight={'bold'}>{'Email :'}</Text>
        <Text>{email}</Text>
        <Text pl={12} fontWeight={'bold'}>{'Téléphone :'}</Text>
        <Text>{phoneNumberString}</Text>
      </HStack>

      <Button
        colorScheme="blue"
        rightIcon={<BsPencil />}
        onClick={() => setUpdateCustomer(true)}
        disabled={true}
      >
        Modifier
      </Button>
    </VStack>
  )
}
