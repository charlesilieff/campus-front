// import { CheckCircleIcon } from '@chakra-ui/icons'
// import {
//   Button,
//   Heading,
//   HStack,
//   Text,
//   VStack
// } from '@chakra-ui/react'
// import * as O from '@effect/data/Option'
// import React from 'react'
// import { BsPencil } from 'react-icons/bs'

// import type { User } from './reservation-update'

// interface UserSummaryProps {
//   user: User
//   setUpdateUser: (updateUser: boolean) => void
// }

// export const UserSummary = (
//   {
//     user: {
//       email,
//       firstname,
//       lastname
//     },
//     setUpdateUser
//   }: UserSummaryProps
// ): JSX.Element => {
//   const phoneNumberString = O.getOrElse(lastname, () => 'Pas de de nom renseigné') // todo to be delete?
//   return (
//     <VStack
//       alignItems={'flex-start'}
//       border={'solid'}
//       p={4}
//       borderRadius={8}
//       borderColor={'#D9D9D9'}
//       my={4}
//     >
//       <HStack>
//         <Heading size={'lg'} marginBottom={4}>
//           Informations personnelles <CheckCircleIcon color={'green'}></CheckCircleIcon>
//         </Heading>
//       </HStack>

//       <HStack py={2}>
//         <Text fontWeight={'bold'}>{'Nom :'}</Text>
//         <Text fontWeight={'bold'}>{'Age :'}</Text>
//         {firstname ?
//           (
//             <>
//               <Text>{O.getOrNull(firstname)}</Text>
//             </>
//           ) :
//           <Text>Non renseigné</Text>}
//         <Text pl={12} fontWeight={'bold'}>{'Prénom :'}</Text>
//         <Text fontWeight={'bold'}>{'Age :'}</Text>
//         {lastname ?
//           (
//             <>
//               <Text>{O.getOrNull(lastname)}</Text>
//             </>
//           ) :
//           <Text>Non renseigné</Text>}
//         <Text pl={12} fontWeight={'bold'}>{'Prénom :'}</Text>

//         <Text>{email}</Text>
//       </HStack>
//       <VStack alignItems={'flex-start'} py={2}>
//         {
//           /* {O.isSome(age) ?
//           (
//             <HStack py={2}>
//               <Text fontWeight={'bold'}>{'Age :'}</Text>
//               {age.value ?
//                 (
//                   <>
//                     <Text>{age.value}</Text>
//                     <Text>{' '}ans</Text>
//                   </>
//                 ) :
//                 <Text>Non renseigné</Text>}
//             </HStack>
//           ) :
//           null} */
//         }
//       </VStack>
//       <HStack py={2}>
//         <Text fontWeight={'bold'}>{'Email :'}</Text>
//         <Text>{email}</Text>
//         <Text pl={12} fontWeight={'bold'}>{'Téléphone :'}</Text>
//       </HStack>

//       <Button
//         colorScheme="blue"
//         rightIcon={<BsPencil />}
//         onClick={() => setUpdateUser(true)}
//         disabled={true}
//       >
//         Modifier
//       </Button>
//     </VStack>
//   )
// }
