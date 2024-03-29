import { CheckIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Stack,
  VStack
} from '@chakra-ui/react'
import { useAppDispatch } from 'app/config/store'
import { getUsersAsAdmin } from 'app/modules/administration/user-management/user-management.reducer'
import { Option as O } from 'effect'
import React, { useEffect } from 'react'

interface UserUpdateProps {
  setUserId: (userId: O.Option<number>) => void
  setUpdateUser: (updateUser: boolean) => void
  email: string
  setUpdateMeal: (updateMeal: boolean) => void
  setUpdateCustomer: (updateCustomer: boolean) => void
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

  const handleChangeUser = () => {
    props.setUserId(O.none())
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
        <Box minW={'500px'}>
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
                  {props.email}
                </FormLabel>
              </FormControl>
            </Stack>
            <Button
              rightIcon={<CheckIcon />}
              colorScheme={'blue'}
              alignSelf={'flex-start'}
              type="submit"
              onClick={handleChangeUser}
            >
              Modifier
            </Button>
          </VStack>
        </Box>
      </VStack>
    </VStack>
  )
}
