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
import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import * as S from '@effect/schema/Schema'
import type { Customer, CustomerDecoded } from 'app/shared/model/customer.model'
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
  firstname: string
  lastname: string
  email: string
  phoneNumber?: string
  age?: number
}

interface FormCustomerDecoded {
  id: O.Option<number>
  firstname: string
  lastname: string
  email: string
  phoneNumber: O.Option<string>
  age: O.Option<number>
}

const CustomerForm: S.Schema<FormCustomer, FormCustomerDecoded> = S.struct({
  id: S.optional(S.number).toOption(),
  firstname: S.string,
  lastname: S.string,
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
        O.map(S.encode(CustomerForm)),
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
                <FormControl isRequired isInvalid={errors.firstname !== undefined}>
                  <FormLabel htmlFor="firstname" fontWeight={'bold'}>
                    {'Prénom'}
                  </FormLabel>
                  <Input
                    id="firstname"
                    type="text"
                    placeholder="Prénom"
                    {...register('firstname', {
                      required: 'Le prénom est obligatoire'
                    })}
                  />

                  <FormErrorMessage>
                    {errors.firstname && errors.firstname.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={errors.lastname !== undefined}>
                  <FormLabel htmlFor="lastname" fontWeight={'bold'}>
                    {'Nom'}
                  </FormLabel>
                  <Input
                    id="lastname"
                    type="text"
                    placeholder="Nom"
                    {...register('lastname', {
                      required: 'Le prénom est obligatoire'
                    })}
                  />

                  <FormErrorMessage>
                    {errors.lastname && errors.lastname.message}
                  </FormErrorMessage>
                </FormControl>
              </HStack>
              <HStack spacing={12} minW={800} my={4}>
                <FormControl isRequired isInvalid={errors.firstname !== undefined}>
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
