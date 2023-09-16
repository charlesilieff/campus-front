import { CheckIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  VStack
} from '@chakra-ui/react'
import * as S from '@effect/schema/Schema'
import type { Customer, CustomerDecoded } from 'app/shared/model/customer.model'
import { Option as O } from 'effect'
import { pipe } from 'effect'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { BsPencil } from 'react-icons/bs'

import { schemaResolver } from '../bed/resolver'

interface CustomerUpdateProps {
  setCustomer: (customer: O.Option<Customer>) => void
  setUpdateCustomer: (updateCustomer: boolean) => void
  setIsCustomerSaved: (isSaved: boolean) => void
  customer: O.Option<Customer>
}

export interface FormCustomer {
  id?: number
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  age?: number
}

interface FormCustomerDecoded {
  id: O.Option<number>
  firstName: string
  lastName: string
  email: string
  phoneNumber: O.Option<string>
  age: O.Option<number>
}

const CustomerForm: S.Schema<FormCustomer, FormCustomerDecoded> = S.struct({
  id: S.optional(S.number).toOption(),
  firstName: S.string,
  lastName: S.string,
  email: S.string,
  phoneNumber: S.optional(S.string).toOption(),
  age: S.optional(S.number).toOption()
})

export const CustomerUpdate = (
  props: CustomerUpdateProps
): JSX.Element => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset: resetForm
  } = useForm<FormCustomer>({
    resolver: schemaResolver(CustomerForm)
  })
  useEffect(() => {
    resetForm(
      pipe(
        props.customer,
        O.map(S.encodeSync(CustomerForm)),
        O.getOrElse(() => ({}))
      )
    )
  }, [props.customer])

  const handleValidCustomerSubmit = (
    customer: FormCustomerDecoded
  ): void => {
    props.setCustomer(
      O.some({ ...customer, comment: pipe(props.customer, O.flatMap(c => c.comment)) })
    )
    props.setUpdateCustomer(false)
  }

  return (
    <VStack alignItems={'flex-start'}>
      <VStack
        minW={'100%'}
        alignItems={'flex-start'}
        border={'solid'}
        p={4}
        borderRadius={8}
        borderColor={'#D9D9D9'}
      >
        <HStack>
          <Heading size={'md'}>
            Informations personnelles
          </Heading>

          <BsPencil size={'30px'} color={'black'}></BsPencil>
        </HStack>
        <Box minW={'500px'}>
          <form
            onSubmit={handleSubmit(v => handleValidCustomerSubmit(v as unknown as CustomerDecoded))}
          >
            <VStack spacing={10} alignItems={'left'}>
              <HStack spacing={12} minW={600} my={4}>
                <FormControl isRequired isInvalid={errors.firstName !== undefined}>
                  <FormLabel htmlFor="firstName" fontWeight={'bold'}>
                    {'Prénom'}
                  </FormLabel>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Prénom"
                    {...register('firstName', {
                      required: 'Le prénom est obligatoire'
                    })}
                  />

                  <FormErrorMessage>
                    {errors.firstName && errors.firstName.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={errors.lastName !== undefined}>
                  <FormLabel htmlFor="lastName" fontWeight={'bold'}>
                    {'Nom'}
                  </FormLabel>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Nom"
                    {...register('lastName', {
                      required: 'Le prénom est obligatoire'
                    })}
                  />

                  <FormErrorMessage>
                    {errors.lastName && errors.lastName.message}
                  </FormErrorMessage>
                </FormControl>
              </HStack>
              <HStack spacing={12} minW={800} my={4}>
                <FormControl isRequired isInvalid={errors.firstName !== undefined}>
                  <FormLabel htmlFor="email" fontWeight={'bold'}>
                    {'Email'}
                  </FormLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    {...register('email', {
                      required: "L'email est obligatoire"
                    })}
                  />

                  <FormErrorMessage>
                    {errors.email && errors.email.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="phoneNumber" fontWeight={'bold'}>
                    {'Téléphone'}
                  </FormLabel>
                  <Input
                    id="phoneNumber"
                    type="string"
                    placeholder="Téléphone"
                    {...register('phoneNumber', {})}
                  />

                  <FormErrorMessage>
                    {errors.phoneNumber && errors.phoneNumber.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="age" fontWeight={'bold'}>
                    {'Age'}
                  </FormLabel>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Age"
                    {...register('age', { valueAsNumber: true })}
                  />

                  <FormErrorMessage>
                    {errors.age && errors.age.message}
                  </FormErrorMessage>
                </FormControl>
              </HStack>

              <Button
                rightIcon={<CheckIcon />}
                colorScheme={'green'}
                alignSelf={'flex-start'}
                type="submit"
                onClick={() => props.setIsCustomerSaved(false)}
              >
                Confirmer
              </Button>
            </VStack>
          </form>
        </Box>
      </VStack>
    </VStack>
  )
}
