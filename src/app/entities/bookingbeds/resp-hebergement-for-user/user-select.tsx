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
import { value } from '@effect/io/Metric'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { Customer } from 'app/entities/customer/customer'
// import type { Customer } from './reservation-update'
import { getEntities as getCustomers } from 'app/entities/customer/customer.reducer'
import { customer as getCustomer } from 'app/entities/customer/customer.reducer'
import { newCustomer as createEntity } from 'app/entities/customer/customer.reducer'
import { getUsersAsAdmin } from 'app/modules/administration/user-management/user-management.reducer'
import type { IUser } from 'app/shared/model/user.model'
import { keyBy } from 'lodash'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { BsPencil } from 'react-icons/bs'
// interface CustomerUpdateProps {
//   setCustomer: (customer: O.Option<Customer>) => void
//   setUpdateCustomer: (updateCustomer: boolean) => void
//   customer: O.Option<Customer>
// }

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

  const handleValidCustomerSubmit = (
    user: FormUserToChoice
  ): void => {
    UserSelected.email = user.userEmail
    UserSelected.lastname = user.userLastName
    UserSelected.firstname = user.userFirstName

    // // @ts-expect-error react hook form ne gère pas bien le type de age
    // const age = customer.age === undefined || customer.age === '' ? O.none() : O.some(customer.age)
    // const phoneNumber = customer.phoneNumber === undefined || customer.phoneNumber === '' ?
    //   O.none() :
    //   O.some(customer.phoneNumber)
    // props.setCustomer(O.some({ ...customer, age, phoneNumber }))

    // props.setUpdateCustomer(false)

    // getUsersAsAdmin()
    // Customer(user.userId, user.userFirstName, user.userLastName)

    // const newCustomer = new IUser(
    //   user.userId,
    //   user.userFirstName,
    //   user.userLastName,
    //   user.userEmail

    // )

    // props.userId = user.userId
    // props.userFirstName = user.userFirstName
    // props.userLastName = user.userLastName
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
                  /* <FormControl isInvalid={users. !== undefined}>
                  <FormLabel htmlFor="firstname" fontWeight={'bold'}>
                    {'Prénom'}
                  </FormLabel>
                  <Text
                    id="firstname"
                    placeholder="Prénom"
                    {...register('userFirstName', {
                      required: 'Le prénom est obligatoire'
                    })}
                  />

                  <FormErrorMessage>
                    {errors.userFirstName && errors.userFirstName.message}
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
