import { CheckIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Stack,
  VStack
} from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getUsersAsAdmin } from 'app/modules/administration/user-management/user-management.reducer'
import React, { useEffect } from 'react'
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

  // const [userSelect, setUserSelect] = useState('default' as string)

  const users1 = useAppSelector(state => state.userManagement.users)

  const myData = users1.flatMap(user => ({
    ...user
  }))
  const users = myData.sort((a, b) => a.email.localeCompare(b.email))

  const {
    handleSubmit
    // register
    // formState: { errors }
  } = useForm<FormUser>()

  const handleValidUserSubmit = (
    formUser: FormUser
  ) => {
    // console.log('userSelect', userSelect)
    console.log('formUser email', formUser)
    console.log('list users', users)
    console.log('id to find', Number(formUser.id))

    props.setUserId(null)
    props.setUpdateMeal(true)
    props.setUpdateCustomer(true)
    props.setUpdateUser(true) // todo false if we want to update the user
  }

  return (
    <VStack alignItems={'flex-start'}>
      <VStack
        w={'100%'}
        alignItems={'flex-start'}
        border={'solid'}
        p={4}
        borderRadius={8}
        borderColor={'green'}
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
            <VStack spacing={2} alignItems={'left'}>
              <Stack
                spacing={2}
                alignItems={'flex-start'}
                width="100%"
                direction={['column', 'row']}
              >
                <FormControl>
                  <FormLabel htmlFor="users" fontWeight={'bold'}>
                    {'Email :'}
                  </FormLabel>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="users">
                    {props.customer.email}
                  </FormLabel>
                </FormControl>
              </Stack>
              {
                /* <Stack
                spacing={2}
                alignItems={'flex-start'}
                width="100%"
                direction={['column', 'row']}
              >
                <FormControl>
                  <FormLabel htmlFor="users" fontWeight={'bold'}>
                    {'Prénom : '}
                  </FormLabel>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="users">
                    {props.customer.firstname}
                  </FormLabel>
                </FormControl>
              </Stack>
              <Stack
                spacing={2}
                alignItems={'flex-start'}
                width="100%"
                direction={['column', 'row']}
              >
                <FormControl>
                  <FormLabel htmlFor="users" fontWeight={'bold'}>
                    {'Nom : '}
                  </FormLabel>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="users">
                    {props.customer.lastname}
                  </FormLabel>
                </FormControl>
              </Stack> */
              }

              <Button
                rightIcon={<CheckIcon />}
                colorScheme={'blue'}
                alignSelf={'flex-start'}
                type="submit"
              >
                Modifier
              </Button>
            </VStack>
          </form>
        </Box>
      </VStack>
    </VStack>
  )
}
