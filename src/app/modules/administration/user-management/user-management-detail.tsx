import { Badge, Box, Button, Heading, Text, VStack } from '@chakra-ui/react'
import * as O from '@effect/data/Option'
import { APP_DATE_FORMAT } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { TextFormat } from 'app/entities/bookingbeds/text-format'
import React, { useEffect } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'

import { getUser } from './user-management.reducer'

export const UserManagementDetail = () => {
  const dispatch = useAppDispatch()
  const { login } = useParams<'login'>()
  useEffect(() => {
    if (login) {
      dispatch(getUser(login))
    }
  }, [])

  const user = useAppSelector(state => state.userManagement.user)

  return (
    <>
      {O.isSome(user) ?
        (
          <VStack>
            <Heading size={'lg'}>
              User {user.value.login}
            </Heading>

            <Box>
              <Heading size={'md'}>Login</Heading>
              <Box>
                <Text>{user.value.login}</Text>&nbsp;
                {user.value.activated ?
                  <Badge backgroundColor="green">Activated</Badge> :
                  <Badge backgroundColor="red">Deactivated</Badge>}
              </Box>
              <Heading size={'md'}>First Name</Heading>
              <dd>{O.getOrNull(user.value.firstName)}</dd>
              <Heading size={'md'}>Last Name</Heading>
              <dd>{O.getOrNull(user.value.lastName)}</dd>
              <Heading size={'md'}>Email</Heading>
              <dd>{user.value.email}</dd>
              <Heading size={'md'}>Created By</Heading>
              <dd>{user.value.createdBy}</dd>
              <Heading size={'md'}>Created Date</Heading>
              <dd>
                {user.value.createdDate ?
                  (
                    <TextFormat
                      value={user.value.createdDate}
                      type="date"
                      format={APP_DATE_FORMAT}
                      blankOnInvalid
                    />
                  ) :
                  null}
              </dd>
              <Heading size={'md'}>Last Modified By</Heading>
              <dd>{user.value.lastModifiedBy}</dd>
              <Heading size={'md'}>Last Modified Date</Heading>
              <dd>
                {user.value.lastModifiedDate ?
                  (
                    <TextFormat
                      value={user.value.lastModifiedDate}
                      type="date"
                      format={APP_DATE_FORMAT}
                      blankOnInvalid
                    />
                  ) :
                  null}
              </dd>
              <Heading size={'md'}>Profiles</Heading>
              <dd>
                <ul className="list-unstyled">
                  {user.value.authorities ?
                    user.value.authorities.map((authority, i) => (
                      <li key={`user-auth-${i}`}>
                        <Badge backgroundColor={'#3498db'}>{authority}</Badge>
                      </li>
                    )) :
                    null}
                </ul>
              </dd>
            </Box>

            <Button
              as={Link}
              to="/admin/user-management"
              variant={'back'}
              leftIcon={<FaArrowLeft />}
            >
              Retour
            </Button>
          </VStack>
        ) :
        null}
    </>
  )
}
