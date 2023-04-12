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
import * as O from '@effect/data/Option'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { Customer } from 'app/entities/customer/customer'
// import type { Customer } from './reservation-update'
import { getEntities as getCustomers } from 'app/entities/customer/customer.reducer'
import { customer as getCustomer } from 'app/entities/customer/customer.reducer'
import { getUsersAsAdmin } from 'app/modules/administration/user-management/user-management.reducer'
import type { IUser } from 'app/shared/model/user.model'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { BsPencil } from 'react-icons/bs'

import type { User } from './reservation-update'
// interface CustomerUpdateProps {
//   setCustomer: (customer: O.Option<Customer>) => void
//   setUpdateCustomer: (updateCustomer: boolean) => void
//   customer: O.Option<Customer>
// }

interface UserUpdateProps {
  setUser: (user: O.Option<User>) => void
  setUpdateUser: (updateUser: boolean) => void
  user: O.Option<User>
}
interface FormUserToChoice {
  userId: string
  userFirstName: string
  userLastName: string
  userEmail: string
}

export interface FormUser {
  id: number
  login: string
  firstname?: string
  lastname?: string
  email: string
}

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

  const users = useAppSelector(state => state.userManagement.users)
  const {
    handleSubmit,
    register,
    formState: { errors }
    // reset: resetForm
    // watch
  } = useForm<FormUserToChoice>()

  // const personNumber = useRef({})
  // personNumber.current = watch('personNumber', 0)

  // useEffect(() => {
  //   resetForm() // O.isSome(props.customer) ?
  //   //   {
  //   //     ...props.customer.value,
  //   //     age: O.getOrUndefined(props.customer.value.age),
  //   //     phoneNumber: O.getOrUndefined(props.customer.value.phoneNumber)
  //   //   } :
  //   //   {}
  // }, [props.userFirstName, props.userLastName, props.userId])

  // const saveEntity = (values: FormCustomer) => {
  //   const entity: ICustomer = {
  //     ...customerEntity,
  //     ...values,
  //     // @ts-expect-error : age is a number
  //     age: values.age === '' ? 0 : values.age
  //   }

  //   if (isNew) {
  //     dispatch(createEntity(entity))
  //   } else {
  //     dispatch(updateEntity(entity))
  //   }
  // }

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
  //           // age: O.getOrUndefined(props.user.value.age),
  //           // phoneNumber: O.getOrUndefined(props.user.value.phoneNumber)
  //         } :
  //         {}
  //     )
  //   }, [props.user])

  // const handleValidUserSubmit = (
  //   user: FormUser
  // ): void => {
  //   // @ts-expect-error react hook form ne gère pas bien le type de age
  //   // const age = user.age === undefined || user.age === '' ? O.none() : O.some(user.age)
  //   // const phoneNumber = user.phoneNumber === undefined || user.phoneNumber === '' ?
  //   //   O.none() :
  //   //   O.some(user.phoneNumber)
  //   // props.setUser(O.some({ ...user, age, phoneNumber }))

  //   props.setUpdateUser(false)
  // }

  const handleValidCustomerSubmit = (
    user: User
  ): void => {
    // const lastname = user.lastname === undefined || user.lastname === '' ?
    //   O.none() :
    //   O.some(user.lastname)
    // const firstname = user.firstname === undefined || user.firstname === '' ?
    //   O.none() :
    //   O.some(user.firstname)
    // props.setUser(O.some({ ...user, lastname, firstname }))

    props.setUser(O.some(user))

    props.setUpdateUser(false)
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
            onSubmit={handleSubmit(handleValidCustomerSubmit)}
          >
            <VStack spacing={10} alignItems={'left'}>
              <HStack spacing={12} minW={800} my={4}>
                <FormControl>
                  <FormLabel htmlFor="users" fontWeight={'bold'}>
                    {'Utilisateur'}
                  </FormLabel>

                  <Select
                    id="user"
                    {...register('userId', {})}
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
                  //   <FormControl isInvalid={users.id !== undefined}>
                  //   <FormLabel htmlFor="firstname" fontWeight={'bold'}>
                  //     {'Prénom'}
                  //   </FormLabel>
                  //   <Text
                  //     id="firstname"
                  //     placeholder="Prénom"
                  //     {...register('userFirstName', {
                  //       required: 'Le prénom est obligatoire'
                  //     })}
                  //   />

                  //   <FormErrorMessage>
                  //     {errors.userFirstName && errors.userFirstName.message}
                  //   </FormErrorMessage>
                  // </FormControl>
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
