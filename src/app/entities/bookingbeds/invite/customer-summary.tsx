import { CheckCircleIcon } from '@chakra-ui/icons'
import {
  Button,
  Heading,
  HStack,
  Stack,
  Text,
  VStack
} from '@chakra-ui/react'
import * as O from '@effect/data/Option'
import React from 'react'
import { BsPencil } from 'react-icons/bs'

import type { Customer } from './reservation-invite-update'

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
      // borderColor={'#D9D9D9'}
      my={4}
      // borderColor={(firstname && lastname && email) ? 'green' : 'green'}
      borderColor={'green'}
    >
      <HStack>
        <Heading size={'lg'} marginBottom={4} my={4}>
          Informations personnelles <CheckCircleIcon color={'green'}></CheckCircleIcon>
        </Heading>
      </HStack>

      <Stack direction={['column', 'row']} alignItems={'flex-start'} my={4}>
        <Text fontWeight={'bold'}>{'Nom :'}</Text>
        <Text>{firstname}</Text>
        <Text pl={screen.availWidth > 400 ? 20 : 0} fontWeight={'bold'}>{'Prénom :'}</Text>
        <Text>{lastname}</Text>
      </Stack>
      <VStack alignItems={'flex-start'} my={4}>
        <Stack direction={['column', 'row']} alignItems={'flex-start'}>
          <Text fontWeight={'bold'}>{'Age :'}</Text>
          {O.isSome(age) ?
            (age.value ?
              (
                <>
                  <Text>{age.value}</Text>
                  <Text>{' '}ans</Text>
                </>
              ) :
              <Text>Non renseigné</Text>) :
            <Text>Non renseigné</Text>}
        </Stack>
      </VStack>
      <Stack direction={['column', 'row']} alignItems={'flex-start'} my={4}>
        <Text fontWeight={'bold'}>{'Email :'}</Text>
        <Text>{email}</Text>
        <Text pl={screen.availWidth > 400 ? 20 : 0} fontWeight={'bold'}>{'Téléphone :'}</Text>
        <Text>{phoneNumberString}</Text>
        {
          /* <Text pl={12} fontWeight={'bold'}>{'Age :'}</Text>
        <Text>{age}</Text> */
        }
      </Stack>

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
