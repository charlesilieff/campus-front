import { Badge, Button, Heading, VStack } from '@chakra-ui/react'
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
    // @ts-expect-error TODO: fix this
    dispatch(getUser(login))
  }, [])

  const user = useAppSelector(state => state.userManagement.user)

  return (
    <VStack>
      <Heading size={'lg'}>
        User {user.login}
      </Heading>

      <dl className="jh-entity-details">
        <dt>Login</dt>
        <dd>
          <span>{user.login}</span>&nbsp;
          {user.activated ?
            <Badge backgroundColor="green">Activated</Badge> :
            <Badge backgroundColor="red">Deactivated</Badge>}
        </dd>
        <dt>First Name</dt>
        <dd>{user.firstName}</dd>
        <dt>Last Name</dt>
        <dd>{user.lastName}</dd>
        <dt>Email</dt>
        <dd>{user.email}</dd>
        <dt>Created By</dt>
        <dd>{user.createdBy}</dd>
        <dt>Created Date</dt>
        <dd>
          {user.createdDate ?
            (
              <TextFormat
                value={user.createdDate}
                type="date"
                format={APP_DATE_FORMAT}
                blankOnInvalid
              />
            ) :
            null}
        </dd>
        <dt>Last Modified By</dt>
        <dd>{user.lastModifiedBy}</dd>
        <dt>Last Modified Date</dt>
        <dd>
          {user.lastModifiedDate ?
            (
              <TextFormat
                value={user.lastModifiedDate}
                type="date"
                format={APP_DATE_FORMAT}
                blankOnInvalid
              />
            ) :
            null}
        </dd>
        <dt>Profiles</dt>
        <dd>
          <ul className="list-unstyled">
            {user.authorities ?
              user.authorities.map((authority, i) => (
                <li key={`user-auth-${i}`}>
                  <Badge backgroundColor={'#3498db'}>{authority}</Badge>
                </li>
              )) :
              null}
          </ul>
        </dd>
      </dl>

      <Button as={Link} to="/admin/user-management" variant={'back'} leftIcon={<FaArrowLeft />}>
        Retour
      </Button>
    </VStack>
  )
}
