import { Alert, AlertIcon, Heading, Text, VStack } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { activateAction, reset } from './activate.reducer'

const successAlert = (
  <Alert status="success">
    <AlertIcon />
    <Text fontWeight={'bold'} pr={2}>Votre compte utilisateur a été activé. {' '}</Text>
    <Text>
      Merci de vous
      <Link to="/login" className="alert-link">
        connecter
      </Link>
    </Text>
    .
  </Alert>
)

const failureAlert = (
  <Alert status="error">
    <AlertIcon />
    <Text fontWeight={'bold'} pr={2}>
      Votre compte utilisateur n&apos;a pas pu être activé. {' '}
    </Text>
    <Text>Utilisez le formulaire d&apos;enregistrement pour en créer un nouveau.</Text>
  </Alert>
)

export const Activate = () => {
  const dispatch = useAppDispatch()

  const [searchParams] = useSearchParams()

  useEffect(() => {
    const key = searchParams.get('key')

    dispatch(activateAction(key))
    return () => {
      dispatch(reset())
    }
  }, [])

  const { activationSuccess, activationFailure } = useAppSelector(state => state.activate)

  return (
    <VStack>
      <Heading size="md">Activation</Heading>
      {activationSuccess ? successAlert : undefined}
      {activationFailure ? failureAlert : undefined}
    </VStack>
  )
}
