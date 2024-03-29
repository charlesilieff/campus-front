import { useAppDispatch, useAppSelector } from 'app/config/store'
import { login } from 'app/shared/reducers/authentication'
import { Option as O } from 'effect'
import React, { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { LoginModal } from './login-modal'

export const Login = () => {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated)

  const showModalLogin = useAppSelector(state => state.authentication.showModalLogin)
  const [showModal, setShowModal] = useState(showModalLogin)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setShowModal(true)
  }, [])

  const handleLogin = (username: string, password: string, rememberMe = false) =>
    dispatch(login(username, password, O.some(rememberMe)))

  const handleClose = () => {
    setShowModal(false)
    navigate('/')
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { from } = (location.state) || { from: { pathname: '/', search: location.search } }
  if (isAuthenticated) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return <Navigate to={from} replace />
  }

  return (
    <LoginModal
      showModal={showModal}
      handleLogin={handleLogin}
      handleClose={handleClose}
    />
  )
}
