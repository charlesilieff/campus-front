import { CheckCircleIcon } from '@chakra-ui/icons'
import {
  Button,
  Heading,
  HStack,
  Text,
  VStack
} from '@chakra-ui/react'
import { Option as O } from 'effect'
import React from 'react'
import { BsPencil } from 'react-icons/bs'

import type { CustomerAndPersonNumberSchema } from './customer-update'

interface CustomerSummaryProps {
  customer: CustomerAndPersonNumberSchema
  setUpdateCustomer: (updateCustomer: boolean) => void
}

export const CustomerSummary = (
  {
    customer: {
      age,
      email,
      firstName,
      lastName,
      phoneNumber,
      personNumber,
      specialDietNumber
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
          Informations du responsable de la réservation{' '}
          <CheckCircleIcon color={'green'}></CheckCircleIcon>
        </Heading>
      </HStack>

      <HStack py={2}>
        <Text fontWeight={'bold'}>{'Nom :'}</Text>
        <Text>{firstName}</Text>
        <Text pl={12} fontWeight={'bold'}>{'Prénom :'}</Text>
        <Text>{lastName}</Text>
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
          null}
      </VStack>
      <HStack py={2}>
        <Text fontWeight={'bold'}>{'Email :'}</Text>
        <Text>{email}</Text>
        <Text pl={12} fontWeight={'bold'}>{'Téléphone :'}</Text>
        <Text>{phoneNumberString}</Text>
      </HStack>
      <HStack py={2}>
        <Text fontWeight={'bold'}>{'Nombre de personnes :'}</Text>
        <Text>{personNumber}</Text>
        <Text pl={12} fontWeight={'bold'}>{'Nombre de régimes sans lactose/gluten :'}</Text>
        <Text>{specialDietNumber}</Text>
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
