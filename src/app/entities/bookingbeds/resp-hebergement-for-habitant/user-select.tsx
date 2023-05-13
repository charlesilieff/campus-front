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
import type { IUser } from 'app/shared/model/user.model'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { BsPencil } from 'react-icons/bs'

import type { Customer } from './reservation-update'

interface UserUpdateProps {
  setCustomer: (user: O.Option<Customer>) => void
  setUserId: (userId: number) => void
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

  const [userSelect, setUserSelect] = useState<O.Option<string>>(O.none())

  const userOderByEmail: Order<IUser> = {
    compare: (self, that) => String.Order.compare(self.email, that.email)
  }

  const users = pipe(
    useAppSelector(state => state.userManagement.users),
    A.filter(u => pipe(u.authorities, A.contains(String.Equivalence)('ROLE_HABITANT'))),
    A.sort<IUser>(userOderByEmail)
  )

  const {
    handleSubmit,
    register
  } = useForm<FormUser>()

  const handleValidUserSubmit = (
    formUser: FormUser
  ) => {
    props.setUserId(Number(formUser.id))

    pipe(
      users,
      A.findFirst(user => user.id === Number(formUser.id)),
      O.map(x => ({
        firstname: x.firstName,
        lastname: x.lastName,
        email: x.email,
        id: x.id,
        phoneNumber: O.none(),
        customerId: O.some(x.customerId),
        age: O.none()
      } as Customer)),
      props.setCustomer
    )

    users.find(user => user.id === Number(formUser.id)).firstName
      && users.find(user => user.id === Number(formUser.id)).lastName ?
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
            Selectionner l&apos;utilisateur
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
                    onChange={e => setUserSelect(O.some(e.target.value))}
                    id="user"
                    {...register('id', {})}
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
                colorScheme={userSelect ? 'green' : 'red'}
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