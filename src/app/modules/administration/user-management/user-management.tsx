import { Badge, Button, Heading, HStack, Table, Tbody, Td, Text, Th, Thead, Tr,
  VStack } from '@chakra-ui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { APP_DATE_FORMAT } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import type { IUser } from 'app/shared/model/user.model'
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils'
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants'
import React, { useEffect, useState } from 'react'
import { FaEye, FaPencilAlt, FaPlus, FaSync } from 'react-icons/fa'
import { getSortState, JhiItemCount, JhiPagination, TextFormat } from 'react-jhipster'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { getUsersAsAdmin, updateUser } from './user-management.reducer'
import { UserManagementDeleteDialog } from './user-managementdelete-dialog'

export const UserManagement = () => {
  const dispatch = useAppDispatch()

  const location = useLocation()
  const navigate = useNavigate()

  const [pagination, setPagination] = useState(
    overridePaginationStateWithQueryParams(
      getSortState(location, ITEMS_PER_PAGE, 'id'),
      location.search
    )
  )

  const getUsersFromProps = () => {
    dispatch(
      getUsersAsAdmin({
        page: pagination.activePage - 1,
        size: pagination.itemsPerPage,
        sort: `${pagination.sort},${pagination.order}`
      })
    )
    const endURL = `?page=${pagination.activePage}&sort=${pagination.sort},${pagination.order}`
    if (location.search !== endURL) {
      navigate(`${location.pathname}${endURL}`)
    }
  }

  useEffect(() => {
    getUsersFromProps()
  }, [pagination.activePage, pagination.order, pagination.sort])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const page = params.get('page')
    const sortParam = params.get(SORT)
    if (page && sortParam) {
      const sortSplit = sortParam.split(',')
      setPagination({
        ...pagination,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1]
      })
    }
  }, [location.search])

  const sort = p => () =>
    setPagination({
      ...pagination,
      order: pagination.order === ASC ? DESC : ASC,
      sort: p
    })

  const handlePagination = currentPage =>
    setPagination({
      ...pagination,
      activePage: currentPage
    })

  const handleSyncList = () => {
    getUsersFromProps()
  }

  const toggleActive = (user: IUser) => () => {
    dispatch(
      updateUser({
        ...user,
        activated: !user.activated
      })
    )
  }

  const users = useAppSelector(state => state.userManagement.users)
  const totalItems = useAppSelector(state => state.userManagement.totalItems)
  const loading = useAppSelector(state => state.userManagement.loading)

  return (
    <VStack alignItems={'flex-start'}>
      <Heading size={'lg'}>Utilisateurs</Heading>
      <HStack alignSelf={'flex-end'}>
        <Button onClick={handleSyncList} isLoading={loading} variant="see" leftIcon={<FaSync />}>
          Actualiser la liste
        </Button>
        <Link
          to={`new`}
          className="btn btn-primary jh-create-entity"
          id="jh-create-entity"
          data-cy="entityCreateButton"
        >
          <HStack>
            <FaPlus />
            <Text>Créer un nouvel utilisateur</Text>
          </HStack>
        </Link>
      </HStack>

      <Table>
        <Thead>
          <Tr>
            <Th className="hand" onClick={sort('id')}>
              ID
              <FontAwesomeIcon icon="sort" />
            </Th>
            <Th className="hand" onClick={sort('login')}>
              Login
              <FontAwesomeIcon icon="sort" />
            </Th>
            <Th className="hand" onClick={sort('email')}>
              Email
              <FontAwesomeIcon icon="sort" />
            </Th>
            <Th />
            <Th>Droits</Th>
            <Th className="hand" onClick={sort('createdDate')}>
              Créé le
              <FontAwesomeIcon icon="sort" />
            </Th>
            <Th className="hand" onClick={sort('lastModifiedBy')}>
              Modifié par
              <FontAwesomeIcon icon="sort" />
            </Th>
            <Th id="modified-date-sort" className="hand" onClick={sort('lastModifiedDate')}>
              Modifié le
              <FontAwesomeIcon icon="sort" />
            </Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user, i) => (
            <Tr id={user.login} key={`user-${i}`}>
              <Td>
                <Button as={Link} to={user.login} variant="see" size="sm">
                  {user.id}
                </Button>
              </Td>
              <Td>{user.login}</Td>
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
              </Td>
              <Td>{user.lastModifiedBy}</Td>
              <Td>
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
              </Td>
              <Td className="text-end">
                <div className="btn-group flex-btn-group-container">
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
                  <UserManagementDeleteDialog login={user.login} />
                </div>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {totalItems ?
        (
          <div className={users?.length > 0 ? '' : 'd-none'}>
            <div className="justify-content-center d-flex">
              <JhiItemCount
                page={pagination.activePage}
                total={totalItems}
                itemsPerPage={pagination.itemsPerPage}
                i18nEnabled
              />
            </div>
            <div className="justify-content-center d-flex">
              <JhiPagination
                activePage={pagination.activePage}
                onSelect={handlePagination}
                maxButtons={5}
                itemsPerPage={pagination.itemsPerPage}
                totalItems={totalItems}
              />
            </div>
          </div>
        ) :
        ('')}
    </VStack>
  )
}
