import {
  FormControl,
  Input,
  VStack
} from '@chakra-ui/react'
import type * as O from '@effect/data/Option'
import * as S from '@effect/schema/Schema'
import React from 'react'
import { useForm } from 'react-hook-form'

import { schemaResolver } from './resolver'

export const BedUpdate = () => {
  // interface BedEncoded {
  //   id?: number
  //   name: string
  // }

  // interface BedDecoded {
  //   id: O.Option<number>
  //   name: string
  // }

  const Bed = S.struct({
    id: S.optional(S.number).toOption(),
    name: S.string
  })

  const form = useForm({
    resolver: schemaResolver(Bed)
  })

  const register = form.register
  return (
    <VStack spacing={8}>
      <form
        onSubmit={handleSubmit(v => (console.log(v)))}
      >
        <VStack spacing={4}>
          <FormControl isRequired isInvalid={errors.name !== undefined}>
            <Input
              id="kind"
              type="text"
              placeholder="Type"
              {...register('name')}
            />
          </FormControl>
        </VStack>
      </form>
    </VStack>
  )
}
