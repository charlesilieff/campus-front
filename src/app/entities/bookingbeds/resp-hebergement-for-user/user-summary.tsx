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
import type * as O from '@effect/data/Option'
import * as A from '@effect/data/ReadonlyArray'
import { EffectTypeId } from '@effect/io/Effect'
import { None } from '@effect/io/Logger/Level'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getUsersAsAdmin } from 'app/modules/administration/user-management/user-management.reducer'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { BsPencil } from 'react-icons/bs'

import type { Customer } from './reservation-update'

interface UserUpdateProps {
  // setCustomer: (user: O.Option<Customer>) => void
  setUserId: (userId: number) => void
  setUpdateUser: (updateUser: boolean) => void
  customer: Customer
  setUpdateMeal: (updateMeal: boolean) => void
  setUpdateCustomer: (updateCustomer: boolean) => void
}

export interface FormUser {
  id: number
}

export const UserSummary = (
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

  const [userSelect, setUserSelect] = useState('default' as string)

  const users1 = useAppSelector(state => state.userManagement.users)

  const myData = users1.flatMap(user => ({
    ...user
  }))
  const users = myData.sort((a, b) => a.email.localeCompare(b.email))

  const {
    handleSubmit,
    register
    // formState: { errors }
  } = useForm<FormUser>()

  const handleValidUserSubmit = (
    formUser: FormUser
  ) => {
    console.log('userSelect', userSelect)
    console.log('formUser email', formUser)
    console.log('list users', users)
    console.log('id to find', Number(formUser.id))
    // props.setUserId(Number(formUser.id))

    // pipe(
    //   users,
    //   A.findFirst(user => user.id === Number(formUser.id)),
    //   O.map(x => ({
    //     firstname: x.firstName,
    //     lastname: x.lastName,
    //     email: x.email,
    //     id: x.id,
    //     phoneNumber: O.none(),
    //     customerId: O.some(x.customerId),
    //     age: O.none()
    //   } as Customer)),
    //   props.setCustomer
    // )
    props.setUserId(null)
    props.setUpdateMeal(true)
    props.setUpdateCustomer(true)
    props.setUpdateUser(true) // todo false if we want to update the user
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
            Selectionner l&apos;utilisateur
          </Heading>
          <BsPencil size={'30px'} color={'black'}></BsPencil>
        </HStack>
        <Box minW={'500px'}>
          <form
            onSubmit={handleSubmit(handleValidUserSubmit)}
          >
            <VStack spacing={10} alignItems={'left'}>
              <HStack spacing={12} minW={800} my={4}>
                <FormControl>
                  <FormLabel htmlFor="users" fontWeight={'bold'}>
                    {'Utilisateur'}
                  </FormLabel>
                  <FormLabel htmlFor="users" fontWeight={'bold'}>
                    {props.customer.email}
                  </FormLabel>

                  {
                    /* <Select
                    onChange={e => setUserSelect(e.target.value)}
                    id="user"
                    {...register('id', {})}
                  >
                    <option value="" key="0" />
                    {users ?
                      users.map(user => (
                        <option value={user.id} key={user.id}>
                          {user.email}
                        </option>
                      )) :
                      null}
                  </Select> */
                  }
                </FormControl>
              </HStack>

              <Button
                rightIcon={<CheckIcon />}
                colorScheme={userSelect ? 'green' : 'red'}
                alignSelf={'flex-start'}
                type="submit"
              >
                {/* {userSelect ? 'Modifier' : 'vvvvvvvvvvvvvvvvvvvvv Confirmer'} */}
                Modifier
              </Button>
            </VStack>
          </form>
        </Box>
      </VStack>
    </VStack>
  )
}
