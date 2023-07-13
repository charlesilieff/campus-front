import { CheckIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Select,
  VStack
} from '@chakra-ui/react'
import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import * as A from '@effect/data/ReadonlyArray'
import * as String from '@effect/data/String'
import type { Order } from '@effect/data/typeclass/Order'
import * as S from '@effect/schema/Schema'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getUsersAsAdmin } from 'app/modules/administration/user-management/user-management.reducer'
import type { User } from 'app/shared/model/user.model'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { BsPencil } from 'react-icons/bs'

const CustomerFromUser = S.struct({
  firstname: S.optional(S.string).toOption(),
  lastname: S.optional(S.string).toOption(),
  email: S.string,
  phoneNumber: S.optional(S.string).toOption(),
  age: S.optional(S.number).toOption()
})

export type CustomerFromUser = S.To<typeof CustomerFromUser>

interface UserUpdateProps {
  setCustomer: (user: O.Option<CustomerFromUser>) => void
  setUserId: (userId: O.Option<number>) => void
  setUpdateUser: (updateUser: boolean) => void
  setUpdateCustomer: (updateUser: boolean) => void
  userSelect: O.Option<string>
  setUserSelect: (userSelect: O.Option<string>) => void
}

export interface FormUser {
  id: number
}

export const UserSelect = (
  props: UserUpdateProps
): JSX.Element => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    getUsersFromProps()
  }, [])
  const getUsersFromProps = () => {
    dispatch(
      getUsersAsAdmin()
    )
  }

  const userOderByEmail: Order<User> = {
    compare: (self, that) => String.Order.compare(self.email, that.email)
  }

  const users = pipe(
    useAppSelector(state => state.userManagement.users),
    A.filter(u => pipe(u.authorities, A.contains(String.Equivalence)('ROLE_EMPLOYEE'))),
    A.sort<User>(userOderByEmail)
  )

  const {
    handleSubmit,
    register
  } = useForm<FormUser>()

  const handleValidUserSubmit = (
    formUser: FormUser
  ) => {
    props.setUserId(O.some(formUser.id))
    pipe(
      users,
      A.findFirst(user => pipe(user.id, O.contains((a, b) => a === b)(formUser.id))),
      O.map(x => ({
        firstname: x.firstName !== undefined ? x.firstName : O.none(),
        lastname: x.lastName !== undefined ? x.lastName : O.none(),
        email: x.email,
        id: x.customerId,
        phoneNumber: O.none(),
        age: O.none(),
        comment: O.none()
      })),
      props.setCustomer
    )

    pipe(
        users,
        A.findFirst(user => pipe(user.id, O.contains((a, b) => a === b)(formUser.id))),
        O.flatMap(x => x.firstName !== undefined ? x.firstName : O.none()),
        O.isSome
      )
      && pipe(
        users,
        A.findFirst(user => pipe(user.id, O.contains((a, b) => a === b)(formUser.id))),
        O.flatMap(x => x.lastName !== undefined ? x.lastName : O.none()),
        O.isSome
      ) ?
      props.setUpdateCustomer(false) :
      props.setUpdateCustomer(true)

    props.setUpdateUser(false)
  }

  return (
    <VStack alignItems={'flex-start'}>
      <VStack
        alignItems={'flex-start'}
        border={'solid'}
        p={4}
        borderRadius={8}
        borderColor={'#D9D9D9'}
        width={'100%'}
      >
        <HStack>
          <Heading size={'md'}>
            Sélectionner l&apos;email
          </Heading>
          <BsPencil size={'30px'} color={'black'}></BsPencil>
        </HStack>
        <Box>
          <form
            onSubmit={handleSubmit(handleValidUserSubmit)}
          >
            <VStack spacing={10} alignItems={'left'}>
              <HStack spacing={12} my={4}>
                <FormControl>
                  <FormLabel htmlFor="users" fontWeight={'bold'}>
                    {'Utilisateur'}
                  </FormLabel>

                  <Select
                    onChange={e => props.setUserSelect(O.some(e.target.value))}
                    id="user"
                    defaultValue={O.getOrElse(props.userSelect, () => '')}
                    {...register('id', {
                      valueAsNumber: true
                    })}
                  >
                    <option value="" key="0" />
                    {users ?
                      users.map(user => (
                        <option value={user.id} key={user.id}>
                          {user.email} {user.firstName ? '; Prénom : ' : null} {user.firstName}
                          {user.firstName ? '; Nom : ' : null}
                          {user.lastName}
                        </option>
                      )) :
                      null}
                  </Select>
                </FormControl>
              </HStack>

              <Button
                rightIcon={<CheckIcon />}
                colorScheme={props.userSelect ? 'green' : 'red'}
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
