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
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getUsersAsAdmin } from 'app/modules/administration/user-management/user-management.reducer'
import type { User } from 'app/shared/model/user.model'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { BsPencil } from 'react-icons/bs'

import type { CustomerForm } from './customer-update'

interface UserUpdateProps {
  setCustomer: (user: O.Option<CustomerForm>) => void
  setUserId: (userId: O.Option<number>) => void
  setUpdateUser: (updateUser: boolean) => void
  setUpdateCustomer: (updateUser: boolean) => void
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
    A.filter(u => pipe(u.authorities, A.contains(String.Equivalence)('ROLE_HABITANT'))),
    A.sort<User>(userOderByEmail)
  )

  const {
    handleSubmit,
    register
  } = useForm<FormUser>()

  const handleValidUserSubmit = (
    formUser: FormUser
  ) => {
    props.setUserId(O.some(Number(formUser.id)))

    pipe(
      users,
      A.findFirst(user => O.contains((a, b) => a === b)(user.id, formUser.id)),
      O.map(x => ({
        age: O.none(),
        firstname: x.firstName !== undefined ? x.firstName : O.none(),
        lastname: x.lastName !== undefined ? x.lastName : O.none(),
        comment: O.none(),
        email: x.email,
        id: x.id,
        phoneNumber: O.none()
      })),
      props.setCustomer
    )

    pipe(
        users,
        A.findFirst(user => O.contains((a, b) => a === b)(user.id, Number(formUser.id))),
        O.flatMap(u =>
          O.struct({
            firstName: u.firstName !== undefined ? u.firstName : O.none(),
            lastName: u.lastName !== undefined ? u.lastName : O.none()
          })
        ),
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
                    id="user"
                    {...register('id', {
                      valueAsNumber: true
                    })}
                  >
                    <option value="" key="0" />
                    {users ?
                      users.map(user => (
                        <option value={O.getOrUndefined(user.id)} key={O.getOrNull(user.id)}>
                          {user.email} {user.firstName !== undefined && O.isSome(user.firstName) ?
                            `; Prénom : ${user.firstName.value}` :
                            null} {user.lastName !== undefined && O.isSome(user.lastName) ?
                            `; Nom : ${user.lastName.value}` :
                            null}
                        </option>
                      )) :
                      null}
                  </Select>
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
