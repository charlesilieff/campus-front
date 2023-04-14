import { CheckIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Select,
  Text,
  VStack
} from '@chakra-ui/react'
import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import * as A from '@effect/data/ReadonlyArray'
import { useAppDispatch, useAppSelector } from 'app/config/store'
// import type { Customer } from './reservation-update'
import { getUsersAsAdmin } from 'app/modules/administration/user-management/user-management.reducer'
import { IUser } from 'app/shared/model/user.model'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { BsPencil } from 'react-icons/bs'

import type { Customer } from './reservation-update'
// interface CustomerUpdateProps {
//   setCustomer: (customer: O.Option<Customer>) => void
//   setUpdateCustomer: (updateCustomer: boolean) => void
//   customer: O.Option<Customer>
// }

interface UserUpdateProps {
  setCustomer: (user: O.Option<Customer>) => void
  setUserId: (userId: number) => void
  setUpdateUser: (updateUser: boolean) => void
}
// interface FormUserToChoice {
//   userId: string
//   userFirstName: string
//   userLastName: string
//   userEmail: string
// }

export interface FormUser {
  id: number
}

// const url = 'api/admin/users' // .in("api" / "admin" / "users" / path[String]("login"))

export const UserSelect = (
  // UserSelected: {
  //   email,
  //   firstname,
  //   lastname,
  // }
  // lastname: string,
  // firstname: string
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
  // const [user, setUser] = useState<O.Option<User>>(O.none)
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

  //   props.setUpdateUser(false)
  // export const UserUpdate = (
  //   props: UserUpdateProps
  // ): JSX.Element => {
  //   const {
  //     handleSubmit,
  //     register,
  //     formState: { errors },
  //     reset: resetForm
  //   } = useForm<FormUser>()
  //   useEffect(() => {
  //     resetForm(
  //       O.isSome(props.user) ?
  //         {
  //           ...props.user.value,
  //           lastname: O.getOrUndefined(props.user.value.lastname),
  //           firstname: O.getOrUndefined(props.user.value.firstname)
  //         } :
  //         {}
  //     )
  //   }, [props.user])

  const handleValidUserSubmit = (
    // user: User
    formUser: FormUser
  ) => {
    // const requestUrl = `${url}/${user.login}`
    // // await axios.get<IMeal[]>(requestUrl)
    // const { data } = await axios.get<IUser>(requestUrl)
    console.log('userSelect', userSelect)
    console.log('formUser email', formUser)
    console.log('list users', users)
    console.log('id to find', Number(formUser.id))
    props.setUserId(Number(formUser.id))
    // props.setUserEmail(formUser.email)

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

    // const lastname = formUser.lastname === undefined || formUser.lastname === '' ?
    //   O.none() :
    //   O.some(formUser.lastname)
    // const firstname = formUser.firstname === undefined || formUser.firstname === '' ?
    //   O.none() :
    //   O.some(formUser.firstname)
    // const phoneNumber = formUser.phoneNumber === undefined || formUser.phoneNumber === '' ?
    //   O.none() :
    //   O.some(formUser.phoneNumber)
    // const customerId = formUser.customerId === undefined ? O.none() : O.some(formUser.customerId)
    // props.setUser(O.some({ ...formUser }))

    console.log('user mail', formUser)
    // props.setUser(formUser)

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

                  <Select
                    onChange={e => setUserSelect(e.target.value)}
                    // onChange={e => setUser(e.target.value)}
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
                  </Select>
                </FormControl>

                {
                  /* <FormControl isInvalid={errors.id !== undefined}>
                  <FormLabel htmlFor="firstname" fontWeight={'bold'}>
                    {'Prénom'}
                  </FormLabel>
                  <Text
                    id="firstname"
                    placeholder="Prénom"
                    // {...register('firstname', {
                    //   required: 'Le prénom est obligatoire'
                    // })}
                  />

                  <FormErrorMessage>
                    {errors.firstname && errors.firstname.message}
                  </FormErrorMessage>
                </FormControl> */
                }
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
