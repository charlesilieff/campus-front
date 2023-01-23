import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { APP_DATE_FORMAT } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils'
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants'
import React, { useEffect, useState } from 'react'
import { getSortState, JhiItemCount, JhiPagination, TextFormat } from 'react-jhipster'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Badge, Button, Row, Table } from 'reactstrap'

import { getUsersAsAdmin, updateUser } from './user-management.reducer'

export const UserManagement = (props: RouteComponentProps<any>) => {
  const dispatch = useAppDispatch()

  const [pagination, setPagination] = useState(
    overridePaginationStateWithQueryParams(
      getSortState(props.location, ITEMS_PER_PAGE, 'id'),
      props.location.search
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
    if (props.location.search !== endURL) {
      props.history.push(`${props.location.pathname}${endURL}`)
    }
  }

  useEffect(() => {
    getUsersFromProps()
  }, [pagination.activePage, pagination.order, pagination.sort])

  useEffect(() => {
    const params = new URLSearchParams(props.location.search)
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
  }, [props.location.search])

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

  const toggleActive = user => () =>
    dispatch(
      updateUser({
        ...user,
        activated: !user.activated
      })
    )

  const { match } = props
  const account = useAppSelector(state => state.authentication.account)
  const users = useAppSelector(state => state.userManagement.users)
  const totalItems = useAppSelector(state => state.userManagement.totalItems)
  const loading = useAppSelector(state => state.userManagement.loading)

  return (
    <div>
      <h2 id="user-management-page-heading" data-cy="userManagementPageHeading">
        Utilisateurs
        <div className="d-flex justify-content-end">
          <Button className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} /> Rafraichîr la liste
          </Button>
          <Link to={`${match.url}/new`} className="btn btn-primary jh-create-entity">
            <FontAwesomeIcon icon="plus" /> Créez un nouvel utilisateur
          </Link>
        </div>
      </h2>
      <Table responsive striped>
        <thead>
          <tr>
            <th className="hand" onClick={sort('id')}>
              ID
              <FontAwesomeIcon icon="sort" />
            </th>
            <th className="hand" onClick={sort('login')}>
              Login
              <FontAwesomeIcon icon="sort" />
            </th>
            <th className="hand" onClick={sort('email')}>
              Email
              <FontAwesomeIcon icon="sort" />
            </th>
            <th />
            <th>Profiles</th>
            <th className="hand" onClick={sort('createdDate')}>
              Date de création
              <FontAwesomeIcon icon="sort" />
            </th>
            <th className="hand" onClick={sort('lastModifiedBy')}>
              Dernière modification par
              <FontAwesomeIcon icon="sort" />
            </th>
            <th id="modified-date-sort" className="hand" onClick={sort('lastModifiedDate')}>
              Date de la dernière modification
              <FontAwesomeIcon icon="sort" />
            </th>
            <th />
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <tr id={user.login} key={`user-${i}`}>
              <td>
                <Button tag={Link} to={`${match.url}/${user.login}`} color="link" size="sm">
                  {user.id}
                </Button>
              </td>
              <td>{user.login}</td>
              <td>{user.email}</td>
              <td>
                {user.activated ?
                  (
                    <Button color="success" onClick={toggleActive(user)}>
                      Activé
                    </Button>
                  ) :
                  (
                    <Button color="danger" onClick={toggleActive(user)}>
                      Désactivé
                    </Button>
                  )}
              </td>
              <td>
                {user.authorities ?
                  user.authorities.map((authority, j) => (
                    <div key={`user-auth-${i}-${j}`}>
                      <Badge color="info">{authority}</Badge>
                    </div>
                  )) :
                  null}
              </td>
              <td>
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
              </td>
              <td>{user.lastModifiedBy}</td>
              <td>
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
              </td>
              <td className="text-right">
                <div className="btn-group flex-btn-group-container">
                  <Button tag={Link} to={`${match.url}/${user.login}`} color="info" size="sm">
                    <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">Voir</span>
                  </Button>
                  <Button
                    tag={Link}
                    to={`${match.url}/${user.login}/edit`}
                    color="primary"
                    size="sm"
                  >
                    <FontAwesomeIcon icon="pencil-alt" />{' '}
                    <span className="d-none d-md-inline">Modifier</span>
                  </Button>
                  <Button
                    tag={Link}
                    to={`${match.url}/${user.login}/delete`}
                    color="danger"
                    size="sm"
                    disabled={account.login === user.login}
                  >
                    <FontAwesomeIcon icon="trash" />{' '}
                    <span className="d-none d-md-inline">Suppimer</span>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {totalItems ?
        (
          <div className={users && users.length > 0 ? '' : 'd-none'}>
            <Row className="justify-content-center">
              <JhiItemCount
                page={pagination.activePage}
                total={totalItems}
                itemsPerPage={pagination.itemsPerPage}
                i18nEnabled
              />
            </Row>
            <Row className="justify-content-center">
              <JhiPagination
                activePage={pagination.activePage}
                onSelect={handlePagination}
                maxButtons={5}
                itemsPerPage={pagination.itemsPerPage}
                totalItems={totalItems}
              />
            </Row>
          </div>
        ) :
        ('')}
    </div>
  )
}

export default UserManagement
