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
import * as O from '@effect/data/Option'
import { useAppDispatch } from 'app/config/store'
import { getUsersAsAdmin } from 'app/modules/administration/user-management/user-management.reducer'
import React, { useEffect } from 'react'
import { BsPencil } from 'react-icons/bs'

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
        <HStack>
          <Heading size={'md'}>
            Selectionner l&apos;utilisateur
          </Heading>
          <BsPencil size={'30px'} color={'black'}></BsPencil>
        </HStack>
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
