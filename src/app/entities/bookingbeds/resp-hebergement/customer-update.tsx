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
import { schemaResolver } from 'app/entities/bed/resolver'
import { Option as O } from 'effect'
import { pipe } from 'effect'
import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { BsPencil } from 'react-icons/bs'

const CustomerAndPersonNumberSchema = S.struct({
  id: S.optional(S.number).toOption(),
  firstname: S.string,
  lastname: S.string,
  email: S.string,
  phoneNumber: S.optional(S.string).toOption(),
  age: S.optional(S.number).toOption(),
  personNumber: S.number,
  specialDietNumber: S.number
})

export type CustomerAndPersonNumberSchema = S.To<typeof CustomerAndPersonNumberSchema>
interface CustomerUpdateProps {
  setCustomer: (customer: O.Option<CustomerAndPersonNumberSchema>) => void
  setUpdateCustomer: (updateCustomer: boolean) => void
  customer: O.Option<CustomerAndPersonNumberSchema>
}
export const CustomerUpdate = (
  props: CustomerUpdateProps
): JSX.Element => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset: resetForm,
    watch
  } = useForm({ resolver: schemaResolver(CustomerAndPersonNumberSchema) })
  const personNumber = useRef(0)
  personNumber.current = watch('personNumber', 0)
  useEffect(() => {
    resetForm(
      pipe(
        props.customer,
        O.map(S.encodeSync(CustomerAndPersonNumberSchema)),
        O.getOrElse(() => ({}))
      )
    )
  }, [props.customer])

  const handleValidCustomerSubmit = (
    customer: CustomerAndPersonNumberSchema
  ): void => {
    props.setCustomer(O.some(customer))

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
            Informations du responsable de la réservation
          </Heading>
          <BsPencil size={'30px'} color={'black'}></BsPencil>
        </HStack>
        <Box minW={'500px'}>
          <form
            onSubmit={handleSubmit(v =>
              handleValidCustomerSubmit(v as unknown as CustomerAndPersonNumberSchema)
            )}
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
                      required: 'Le nom est obligatoire'
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
              <HStack spacing={12} minW={800} my={4}>
                <FormControl isRequired>
                  <FormLabel htmlFor="age" fontWeight={'bold'}>
                    {'Nombre de personnes'}
                  </FormLabel>
                  <Input
                    type="number"
                    placeholder="Nombre de personnes"
                    {...register('personNumber', { valueAsNumber: true })}
                  />

                  <FormErrorMessage>
                    {errors.personNumber && errors.personNumber.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={errors.specialDietNumber !== undefined}>
                  <FormLabel htmlFor="specialDietNumber" fontWeight={'bold'}>
                    {'Nombre de régimes sans gluten OU lactose'}
                  </FormLabel>
                  <Input
                    type="number"
                    {...register('specialDietNumber', {
                      valueAsNumber: true,
                      required: 'Le nombre de régimes spéciaux est obligatoire',
                      validate(v) {
                        if (v > personNumber.current) {
                          return 'Le nombre de régimes spéciaux ne peut pas être supérieur au nombre de personnes'
                        }
                        if (v < 0) {
                          return 'Le nombre de régimes spéciaux ne peut pas être négatif'
                        }
                      }
                    })}
                  />

                  <FormErrorMessage>
                    {errors.specialDietNumber && errors.specialDietNumber.message}
                  </FormErrorMessage>
                </FormControl>
              </HStack>
              <Button
                rightIcon={<CheckIcon />}
                colorScheme={'green'}
                alignSelf={'flex-start'}
                type="submit"
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
