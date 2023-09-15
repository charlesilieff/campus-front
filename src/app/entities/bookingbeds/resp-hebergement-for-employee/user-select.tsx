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
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getUsersAsAdmin } from 'app/modules/administration/user-management/user-management.reducer'
import type { User } from 'app/shared/model/user.model'
import { String } from 'effect'
import { Option as O } from 'effect'
import { ReadonlyArray as A } from 'effect'
import { pipe } from 'effect'
import type { Order } from 'effect/Order'
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

  const userOderByEmail: Order<User> = (self, that) => String.Order(self.email, that.email)

  const users = pipe(
    useAppSelector(state => state.userManagement.users),
    A.filter(u => pipe(u.authorities, A.contains('ROLE_EMPLOYEE'))),
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
      A.findFirst(user => O.contains(user.id, formUser.id)),
      O.map(x => ({
        age: O.none(),
        firstname: x.firstname !== undefined ? x.firstname : O.none(),
        lastname: x.lastname !== undefined ? x.lastname : O.none(),
        comment: O.none(),
        email: x.email,
        id: O.none(),
        phoneNumber: O.none()
      })),
      props.setCustomer
    )

    pipe(
        users,
        A.findFirst(user => O.contains(user.id, Number(formUser.id))),
        O.flatMap(u =>
          O.all({
            firstname: u.firstname !== undefined ? u.firstname : O.none(),
            lastname: u.lastname !== undefined ? u.lastname : O.none()
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
                          {user.email} {user.firstname !== undefined && O.isSome(user.firstname) ?
                            `; Prénom : ${user.firstname.value}` :
                            null} {user.lastname !== undefined && O.isSome(user.lastname) ?
                            `; Nom : ${user.lastname.value}` :
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
