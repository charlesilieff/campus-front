// import { CheckIcon } from '@chakra-ui/icons'
// import {
//   Box,
//   Button,
//   FormControl,
//   FormErrorMessage,
//   FormLabel,
//   Heading,
//   HStack,
//   Input,
//   Stack,
//   VStack
// } from '@chakra-ui/react'
// import {Option as O} from 'effect'
// import React, { useEffect } from 'react'
// import { useForm } from 'react-hook-form'
// import { BsPencil } from 'react-icons/bs'

// import type { Customer } from './reservation-invite-update'

// interface CustomerUpdateProps {
//   setCustomer: (customer: O.Option<Customer>) => void
//   setUpdateCustomer: (updateCustomer: boolean) => void
//   customer: O.Option<Customer>
// }

// export interface FormCustomer {
//   id: number
//   firstName: string
//   lastName: string
//   email: string
//   phoneNumber?: string
//   age?: number
// }

// export const CustomerUpdate = (
//   props: CustomerUpdateProps
// ): JSX.Element => {
//   const {
//     handleSubmit,
//     register,
//     formState: { errors },
//     reset: resetForm
//   } = useForm<FormCustomer>()
//   useEffect(() => {
//     resetForm(
//       // @ts-expect-error TODO: fix this
//       O.isSome(props.customer) ?
//         {
//           ...props.customer.value,
//           age: O.getOrUndefined(props.customer.value.age),
//           phoneNumber: O.getOrUndefined(props.customer.value.phoneNumber)
//         } :
//         {}
//     )
//   }, [props.customer])

//   const handleValidCustomerSubmit = (
//     customer: FormCustomer
//   ): void => {
//     // @ts-expect-error react hook form ne gère pas bien le type de age
//     const age = customer.age === undefined || customer.age === '' ? O.none() : O.some(customer.age)
//     const phoneNumber = customer.phoneNumber === undefined || customer.phoneNumber === '' ?
//       O.none() :
//       O.some(customer.phoneNumber)
//     props.setCustomer(O.some({ ...customer, age, phoneNumber }))

//     props.setUpdateCustomer(false)
//   }

//   return (
//     <VStack alignItems={'flex-start'}>
//       <VStack
//         minW={'100%'}
//         alignItems={'flex-start'}
//         border={'solid'}
//         p={4}
//         borderRadius={8}
//         borderColor={'#D9D9D9'}
//       >
//         <HStack>
//           <Heading size={'md'}>
//             Informations personnelles
//           </Heading>
//           <BsPencil size={'30px'} color={'black'}></BsPencil>
//         </HStack>
//         <Box minW={'400px'}>
//           <form
//             onSubmit={handleSubmit(handleValidCustomerSubmit)}
//           >
//             <VStack alignItems={'flex-start'}>
//               <Stack minW={600} my={4} direction={['column', 'row']}>
//                 <FormControl isRequired isInvalid={errors.firstName !== undefined}>
//                   <FormLabel htmlFor="firstName" fontWeight={'bold'}>
//                     {'Prénom'}
//                   </FormLabel>
//                   <Input
//                     width="auto"
//                     id="firstName"
//                     type="text"
//                     placeholder="Prénom"
//                     {...register('firstName', {
//                       required: 'Le prénom est obligatoire'
//                     })}
//                   />
//                   <FormErrorMessage>
//                     {errors.firstName && errors.firstName.message}
//                   </FormErrorMessage>
//                 </FormControl>
//                 <FormControl
//                   isRequired
//                   isInvalid={errors.lastName !== undefined}
//                   // pl={screen.availWidth > 400 ? 20 : 0}
//                 >
//                   <FormLabel htmlFor="lastName" fontWeight={'bold'}>
//                     {'Nom'}
//                   </FormLabel>
//                   <Input
//                     width="auto"
//                     id="lastName"
//                     type="text"
//                     placeholder="Nom"
//                     {...register('lastName', {
//                       required: 'Le prénom est obligatoire'
//                     })}
//                   />

//                   <FormErrorMessage>
//                     {errors.lastName && errors.lastName.message}
//                   </FormErrorMessage>
//                 </FormControl>
//               </Stack>
//               <Stack minW={600} my={4} direction={['column', 'row']}>
//                 <FormControl
//                   isRequired
//                   isInvalid={errors.firstName !== undefined}
//                   pr={20}
//                 >
//                   <FormLabel htmlFor="email" fontWeight={'bold'}>
//                     {'Email'}
//                   </FormLabel>
//                   <Input
//                     width="auto"
//                     id="email"
//                     type="email"
//                     placeholder="Email"
//                     {...register('email', {
//                       required: "L'email est obligatoire"
//                     })}
//                   />

//                   <FormErrorMessage>
//                     {errors.email && errors.email.message}
//                   </FormErrorMessage>
//                 </FormControl>
//                 <FormControl pr={20}>
//                   <FormLabel htmlFor="phoneNumber" fontWeight={'bold'}>
//                     {'Téléphone'}
//                   </FormLabel>
//                   <Input
//                     width="auto"
//                     id="phoneNumber"
//                     type="string"
//                     placeholder="Téléphone"
//                     {...register('phoneNumber', {})}
//                   />

//                   <FormErrorMessage>
//                     {errors.phoneNumber && errors.phoneNumber.message}
//                   </FormErrorMessage>
//                 </FormControl>
//                 <FormControl>
//                   <FormLabel htmlFor="age" fontWeight={'bold'}>
//                     {'Age'}
//                   </FormLabel>
//                   <Input
//                     width="auto"
//                     id="age"
//                     type="number"
//                     placeholder="Age"
//                     {...register('age')}
//                   />

//                   <FormErrorMessage>
//                     {errors.age && errors.age.message}
//                   </FormErrorMessage>
//                 </FormControl>
//               </Stack>

//               <Button
//                 rightIcon={<CheckIcon />}
//                 colorScheme={'green'}
//                 alignSelf={'flex-start'}
//                 type="submit"
//               >
//                 Confirmer
//               </Button>
//             </VStack>
//           </form>
//         </Box>
//       </VStack>
//     </VStack>
//   )
// }
