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
  Stack,
  VStack
} from '@chakra-ui/react'
import * as S from '@effect/schema/Schema'
import { schemaResolver } from 'app/entities/bed/resolver'
import { Option as O } from 'effect'
import { pipe } from 'effect'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { BsPencil } from 'react-icons/bs'

interface CustomerFormEncoded {
  id?: number
  firstName?: string
  lastName?: string
  age?: number
  phoneNumber?: string
  email: string
  comment?: string
}

export interface CustomerForm {
  id: O.Option<number>
  firstName: O.Option<string>
  lastName: O.Option<string>
  age: O.Option<number>
  phoneNumber: O.Option<string>
  email: string
  comment: O.Option<string>
}

export const CustomerForm: S.Schema<CustomerFormEncoded, CustomerForm> = S.struct({
  id: S.optional(S.number).toOption(),
  firstName: S.optional(S.string).toOption(),
  lastName: S.optional(S.string).toOption(),
  age: S.optional(S.number).toOption(),
  phoneNumber: S.optional(S.string).toOption(),
  email: S.string,
  comment: S.optional(S.string).toOption()
})

interface CustomerUpdateProps {
  setCustomer: (customer: O.Option<CustomerForm>) => void
  setUpdateCustomer: (updateCustomer: boolean) => void
  customer: O.Option<CustomerForm>
}

export const CustomerUpdate = (
  props: CustomerUpdateProps
): JSX.Element => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset: resetForm
  } = useForm({ resolver: schemaResolver(CustomerForm) })
  useEffect(() => {
    resetForm(
      O.isSome(props.customer) ? pipe(props.customer.value, S.encodeSync(CustomerForm)) : {}
    )
  }, [props.customer])

  const handleValidCustomerSubmit = (
    customer: CustomerForm
  ): void => {
    props.setCustomer(O.some(customer))

    props.setUpdateCustomer(false)
  }

  return (
    <VStack alignItems={'flex-start'}>
      <VStack
        alignItems={'flex-start'}
        border={'solid'}
        p={4}
        borderRadius={8}
        borderColor={'#D9D9D9'}
        w={'100%'}
      >
        <HStack>
          <Heading size={'md'}>
            Informations personnelles
          </Heading>
          <BsPencil size={'30px'} color={'black'}></BsPencil>
        </HStack>
        <Box w={'100%'}>
          <form
            onSubmit={handleSubmit(v => handleValidCustomerSubmit(v as unknown as CustomerForm))}
          >
            <Stack
              direction={{ base: 'column', md: 'row' }}
              alignItems={'flex-start'}
              my={4}
            >
              <FormControl isRequired isInvalid={errors.firstName !== undefined} maxW={500}>
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
              <FormControl
                isRequired
                isInvalid={errors.lastName !== undefined}
                px={{ base: '0', md: '20' }}
                maxW={500}
              >
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
            </Stack>
            <Stack
              direction={{ base: 'column', md: 'row' }}
              alignItems={'flex-start'}
              my={4}
            >
              <FormControl maxW={500}>
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
              <FormControl maxW={500} px={{ base: '0', md: '20' }}>
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
            </Stack>
            <Stack spacing={12} maxW={600} my={4}>
              <FormControl isRequired isInvalid={errors.firstName !== undefined}>
                <FormLabel htmlFor="email" fontWeight={'bold'}>
                  {'Email'}
                </FormLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  readOnly={true}
                  disabled={true}
                  {...register('email', {
                    required: "L'email est obligatoire"
                  })}
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>
            </Stack>

            <Button
              rightIcon={<CheckIcon />}
              colorScheme={'green'}
              alignSelf={'flex-start'}
              type="submit"
            >
              Confirmer
            </Button>
          </form>
        </Box>
      </VStack>
    </VStack>
  )
}
