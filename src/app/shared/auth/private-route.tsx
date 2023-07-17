import { useAppSelector } from 'app/config/store'
import { ErrorBoundary } from 'app/shared/error/error-boundary'
import { Option as O } from 'effect'
import { ReadonlyArray as A } from 'effect'
import { pipe } from 'effect'
import React from 'react'
import type { PathRouteProps } from 'react-router-dom'
import { Navigate, useLocation } from 'react-router-dom'

import type { Authorities, User } from '../model/user.model'

interface IOwnProps extends PathRouteProps {
  hasAnyAuthorities?: Authorities[]
  children: React.ReactNode
}

export const PrivateRoute = ({ children, hasAnyAuthorities = [], ...rest }: IOwnProps) => {
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated)
  const sessionHasBeenFetched = useAppSelector(state => state.authentication.sessionHasBeenFetched)
  const account = useAppSelector(state => state.authentication.account)
  const isAuthorized = hasAnyAuthority(account, hasAnyAuthorities)
  const location = useLocation()

  if (!children) {
    throw new Error(
      `A component needs to be specified for private route for path ${rest.path}`
    )
  }

  if (!sessionHasBeenFetched) {
    return <div></div>
  }

  if (isAuthenticated) {
    if (isAuthorized) {
      return <ErrorBoundary>{children}</ErrorBoundary>
    }

    return (
      <div className="insufficient-authority">
        <div className="alert alert-danger">
          {"Vous n'êtes pas autorisé à accéder à cette page."}
        </div>
      </div>
    )
  }

  return (
    <Navigate
      to={{
        pathname: '/login',
        search: location.search
      }}
      replace
      state={{ from: location }}
    />
  )
}

export const hasAnyAuthority = (user: O.Option<User>, hasAnyAuthorities: Authorities[]) =>
  pipe(
    user,
    O.map(u => pipe(u.authorities, A.some(d => A.contains(hasAnyAuthorities, d)))),
    O.exists(d => d)
  )
