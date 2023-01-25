import { CheckCircleIcon } from '@chakra-ui/icons'
import {
  Heading,
  HStack,
  Text,
  VStack
} from '@chakra-ui/react'
import { Option as O } from 'effect'
import React from 'react'

import { Customer } from './reservation-intermittent-update'

interface CustomerSummaryProps {
  customer: Customer
}

export const CustomerSummary = (
  {
    customer: {
      age,
      email,
      firstname,
      lastname,
      phoneNumber
    }
  }: CustomerSummaryProps
): JSX.Element => {
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
          null}
      </VStack>
      <HStack py={2}>
        <Text fontWeight={'bold'}>{'Email :'}</Text>
        <Text>{email}</Text>
        <Text pl={12} fontWeight={'bold'}>{'Téléphone :'}</Text>
        <Text>{phoneNumber}</Text>
      </HStack>
      {
        /* <Button
        colorScheme="blue"
        rightIcon={<BsPencil />}
        onClick={() => setUpdate(true)}
        disabled={true}
      >
        Modifier
      </Button> */
      }
    </VStack>
  )
}
