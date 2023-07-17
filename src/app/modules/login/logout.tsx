/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { logout } from 'app/shared/reducers/authentication'
import { Option as O } from 'effect'
import React, { useLayoutEffect } from 'react'

export const Logout = () => {
  const logoutUrl = useAppSelector(state => state.authentication.logoutUrl)
  const idToken = useAppSelector(state => state.authentication.idToken)
  const dispatch = useAppDispatch()

  useLayoutEffect(() => {
    dispatch(logout())
    if (O.isSome(logoutUrl)) {
      // if Keycloak, logoutUrl has protocol/openid-connect in it
      window.location.href = logoutUrl.value.includes('/protocol') ?
        logoutUrl + '?redirect_uri=' + window.location.origin :
        logoutUrl + '?id_token_hint=' + idToken + '&post_logout_redirect_uri='
        + window.location.origin
    }
  })

  return (
    <div className="p-5">
      <h4>Logged out successfully!</h4>
    </div>
  )
}
