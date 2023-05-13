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
import { useAppDispatch } from 'app/config/store'
import { getUsersAsAdmin } from 'app/modules/administration/user-management/user-management.reducer'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { BsPencil } from 'react-icons/bs'

import type { Customer } from './reservation-update'

interface UserUpdateProps {
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

  const {
    handleSubmit
  } = useForm<FormUser>()

  const handleValidUserSubmit = () => {
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