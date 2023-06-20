import {
  Badge,
  Button,
  Heading,
  HStack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack
} from '@chakra-ui/react'
import * as O from '@effect/data/Option'
import { APP_DATE_FORMAT } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { TextFormat } from 'app/entities/bookingbeds/text-format'
import type { UserDecoded } from 'app/shared/model/user.model'
import React, { useEffect } from 'react'
import { FaEye, FaPencilAlt, FaPlus, FaSync } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import { getUsersAsAdmin, updateUser } from './user-management.reducer'
import { UserManagementDeleteDialog } from './user-managementdelete-dialog'

export const UserManagement = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    getUsersFromProps()
  }, [])
  const getUsersFromProps = () => {
    dispatch(
      getUsersAsAdmin()
    )
  }

  const handleSyncList = () => {
    getUsersFromProps()
  }

  const toggleActive = (user: UserDecoded) => () => {
    dispatch(
      updateUser({
        ...user,
        activated: !user.activated
      })
    )
  }

  const users = useAppSelector(state => state.userManagement.users)

  const loading = useAppSelector(state => state.userManagement.loading)

  return (
    <VStack alignItems={'flex-start'}>
      <Heading size={'lg'}>Utilisateurs</Heading>
      <HStack alignSelf={'flex-end'}>
        <Button onClick={handleSyncList} isLoading={loading} variant="see" leftIcon={<FaSync />}>
          Actualiser la liste
        </Button>
        <Button
          as={Link}
          color={'white'}
          backgroundColor={'#e95420'}
          _hover={{ textDecoration: 'none', color: 'orange' }}
          to={`new`}
          leftIcon={<FaPlus />}
        >
          Créer un nouvel utilisateur
        </Button>
      </HStack>

      <Table size="sm">
        <Thead>
          <Tr>
            <Th>
              Login
            </Th>
            <Th>
              Email
            </Th>
            <Th />
            <Th>Droits</Th>
            <Th>
              Créé le
            </Th>
            <Th>
              Modifié par
            </Th>
            <Th>
              Modifié le
            </Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user, i) => (
            <Tr id={user.login} key={`user-${i}`}>
              <Td>
                <Button as={Link} to={user.login} variant="see" size="sm">{user.login}</Button>
              </Td>
              <Td>{user.email}</Td>
              <Td>
                {user.activated ?
                  (
                    <Button variant={'save'} onClick={toggleActive(user)}>
                      Activé
                    </Button>
                  ) :
                  (
                    <Button variant="danger" onClick={toggleActive(user)}>
                      Désactivé
                    </Button>
                  )}
              </Td>
              <Td>
                {user.authorities ?
                  user.authorities.map((authority, j) => (
                    <div key={`user-auth-${i}-${j}`}>
                      <Badge backgroundColor="#3498db">{authority}</Badge>
                    </div>
                  )) :
                  null}
              </Td>
              <Td>
                <TextFormat
                  value={O.getOrUndefined(user.createdDate)}
                  type="date"
                  format={APP_DATE_FORMAT}
                  blankOnInvalid
                />
              </Td>
              <Td>{user.lastModifiedBy}</Td>
              <Td>
                <TextFormat
                  value={O.getOrUndefined(user.lastModifiedDate)}
                  type="date"
                  format={APP_DATE_FORMAT}
                  blankOnInvalid
                />
              </Td>
              <Td className="text-end">
                <HStack justifyContent={'flex-end'} spacing={0}>
                  <Button
                    as={Link}
                    to={user.login}
                    variant="see"
                    size="sm"
                    leftIcon={<FaEye />}
                    borderRightRadius={0}
                  >
                    Voir
                  </Button>
                  <Button
                    as={Link}
                    to={`${user.login}/edit`}
                    variant="modify"
                    leftIcon={<FaPencilAlt />}
                    size="sm"
                    borderRadius={0}
                  >
                    Éditer
                  </Button>

                  <UserManagementDeleteDialog
                    login={user.login}
                  />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </VStack>
  )
}
