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

export const CustomerForm = S.struct({
  id: S.optional(S.number).toOption(),
  firstname: S.optional(S.string).toOption(),
  lastname: S.optional(S.string).toOption(),
  age: S.optional(S.number).toOption(),
  phoneNumber: S.optional(S.string).toOption(),
  email: S.string,
  comment: S.optional(S.string).toOption()
})

export type CustomerForm = S.Schema.To<typeof CustomerForm>

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
              <FormControl isRequired isInvalid={errors.firstname !== undefined} maxW={500}>
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
              <FormControl
                isRequired
                isInvalid={errors.lastname !== undefined}
                px={{ base: '0', md: '20' }}
                maxW={500}
              >
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
              <FormControl isRequired isInvalid={errors.firstname !== undefined}>
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
