// import { useAppSelector } from 'app/config/store'
// import { ErrorBoundary } from 'app/shared/error/error-boundary'
// import React from 'react'
// import { Translate } from 'react-jhipster'
// import type { RouteProps } from 'react-router-dom'
// import { Navigate, useLocation } from 'react-router-dom'

// interface IOwnProps extends RouteProps {
//   hasAnyAuthorities?: string[]
//   children: React.ReactNode
// }

// export const PrivateRoute = ({ children, hasAnyAuthorities = [], ...rest }: IOwnProps) => {
//   const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated)
//   const sessionHasBeenFetched = useAppSelector(state => state.authentication.sessionHasBeenFetched)
//   const account = useAppSelector(state => state.authentication.account)
//   const isAuthorized = hasAnyAuthority(account.authorities, hasAnyAuthorities)
//   const location = useLocation()

//   if (!children) {
//     throw new Error(
//       `A component needs to be specified for private route for path ${rest.path}`
//     )
//   }

//   if (!sessionHasBeenFetched) {
//     return <div></div>
//   }

//   if (isAuthenticated) {
//     if (isAuthorized) {
//       return <ErrorBoundary>{children}</ErrorBoundary>
//     }

//     return (
//       <div className="insufficient-authority">
//         <div className="alert alert-danger">
//           <Translate contentKey="error.http.403">
//             You are not authorized to access this page.
//           </Translate>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <Navigate
//       to={{
//         pathname: '/login',
//         search: location.search
//       }}
//       replace
//       state={{ from: location }}
//     />
//   )
// }

// export const hasAnyAuthority = (authorities: string[], hasAnyAuthorities: string[]) => {
//   if (authorities && authorities.length !== 0) {
//     if (hasAnyAuthorities.length === 0) {
//       return true
//     }
//     return hasAnyAuthorities.some(auth => authorities.includes(auth))
//   }
//   return false
// }
