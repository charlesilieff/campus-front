// import { Radio, RadioGroup, Text, VStack } from '@chakra-ui/react'
// import {Option as O} from 'effect'
// import type { FunctionComponent } from 'react'
// import React from 'react'

// import type { IRoomWithBeds } from '../utils'

// interface IProps {
//   rooms: ReadonlyArray<IRoomWithBeds>
//   bedId: O.Option<string>
//   selectedBedId: (bedId: O.Option<number>) => void
// }
// export const IntermittentBeds: FunctionComponent<IProps> = (
//   { rooms, selectedBedId, bedId }
// ) => (
//   <RadioGroup
//     onChange={e => {
//       if (e === 'noBed') {
//         selectedBedId(O.none())
//       } else {
//         selectedBedId(O.some(+e))
//       }
//     }}
//     defaultValue={O.getOrElse(bedId, () => 'noBed')}
//   >
//     <Radio
//       value={'noBed'}
//     >
//       <Text fontWeight={'bold'} py={'4'}>
//         {`Aucun lit`}
//       </Text>
//     </Radio>
//     {rooms.map(room => {
//       const bedRoomKind = room.bedroomKind ? `(${room.bedroomKind.name})` : ''
//       // @ts-expect-error TODO: fix this
//       const isRoomFull = room.beds.length === room.beds.filter(b => b.booked).length
//       return (
//         <VStack key={room.id} mb={6} alignItems={'flex-start'}>
//           <Text fontWeight={'bold'} color={isRoomFull ? 'grey' : 'black'}>
//             {`Chambre ${room.name} ${bedRoomKind}`}
//           </Text>

//           {
//             // @ts-expect-error TODO: fix this
//             room.beds.map(bed => {
//               const bedkind = bed.kind ? `(${bed.kind})` : ''
//               const isDisabled = bed.booked
//                 // @ts-expect-error TODO: fix this
//                 && (!O.exists<string>(b => b === bed.id.toString())(bedId))

//               return (
//                 <Radio
//                   key={bed.id}
//                   // @ts-expect-error TODO: fix this
//                   value={bed.id.toString()}
//                   isDisabled={isDisabled}
//                   // @ts-expect-error TODO: fix this
//                   isChecked={O.exists<string>(b => b === bed.id.toString())(bedId)}
//                 >
//                   {`${bed.number} ${bedkind}  (places : ${bed.numberOfPlaces}) ${
//                     isDisabled ? '(réservé)' : ''
//                   }`}
//                 </Radio>
//               )
//             })
//           }
//         </VStack>
//       )
//     })}
//   </RadioGroup>
// )
