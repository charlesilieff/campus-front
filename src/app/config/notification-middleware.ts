/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { createStandaloneToast } from '@chakra-ui/react'

import { isFulfilledAction, isRejectedAction } from '../shared/reducers/reducer.utils'

const { toast } = createStandaloneToast()
// eslint-disable-next-line complexity
export const handleError = () => next => action => {
  const addErrorAlert = (message: string, key?: string, data?: string) => {
    console.log(key, data)
    toast({
      position: 'top',
      title: message,
      status: 'error',
      duration: 4000,
      isClosable: true
    })
  }
  const { error, payload } = action

  /**
   * The notification middleware serves to add success and error notifications
   */
  if (isFulfilledAction(action) && payload && payload.headers) {
    const headers = payload?.headers
    let alert: string | null = null
    headers
      && Object.entries<string>(headers).forEach(([k, v]) => {
        if (k.toLowerCase().endsWith('app-alert')) {
          alert = v
        }
      })
    if (alert) {
      toast({
        position: 'top',
        title: alert,
        status: 'success',
        duration: 4000,
        isClosable: true
      })
    }
  }

  if (isRejectedAction(action) && error && error.isAxiosError) {
    if (error.response) {
      const response = error.response
      const data = response.data
      if (
        !(response.status === 401
          && (error.message === ''
            || (data && data.path
              && (data.path.includes('/api/account')
                || data.path.includes('/api/authenticate')))))
      ) {
        let i
        switch (response.status) {
          // connection refused, server not reachable
          case 0:
            addErrorAlert('Server not reachable', 'error.server.not.reachable')
            break
          case 406:
            if (
              typeof data.raison === 'string'
              && data.raison.includes('ReservationDatesNotAvailableError')
            ) {
              toast({
                position: 'top',
                title: 'Réservation non crée/modifié !',
                description: "L'utilisateur a déjà une réservation pour cette période.",
                status: 'error',
                duration: 9000,
                isClosable: true
              })
            } else if (typeof data === 'string' && data !== '') {
              addErrorAlert(data)
            } else {
              toast({
                position: 'top',
                title: data?.message || data?.error || data?.title || 'Unknown error!',
                status: 'error',
                duration: 4000,
                isClosable: true
              })
            }
            break
          case 400: {
            let errorHeader: string | null = null
            let entityKey: string | undefined = undefined
            response?.headers
              && Object.entries<string>(response.headers).forEach(([k, v]) => {
                if (k.toLowerCase().endsWith('app-error')) {
                  errorHeader = v
                } else if (k.toLowerCase().endsWith('app-params')) {
                  entityKey = v
                }
              })
            if (errorHeader) {
              addErrorAlert(errorHeader, errorHeader, entityKey)
            } else if (data?.fieldErrors) {
              const fieldErrors = data.fieldErrors
              for (i = 0; i < fieldErrors.length; i++) {
                const fieldError = fieldErrors[i]
                if (['Min', 'Max', 'DecimalMin', 'DecimalMax'].includes(fieldError.message)) {
                  fieldError.message = 'Size'
                }
                // convert 'something[14].other[4].id' to 'something[].other[].id' so translations can be written to it
                const convertedField = fieldError.field.replace(/\[\d*\]/g, '[]')
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                const fieldName = convertedField.charAt(0).toUpperCase()
                  + convertedField.slice(1)
                addErrorAlert(
                  `Error on field "${fieldName}"`,
                  `error.${fieldError.message}`,
                  fieldName
                )
              }
            } else if (typeof data === 'string' && data !== '') {
              addErrorAlert(data)
            } else {
              toast({
                position: 'top',
                title: data?.message || data?.error || data?.title || 'Unknown error!',
                status: 'error',
                duration: 4000,
                isClosable: true
              })
            }
            break
          }
          case 404:
            addErrorAlert('Not found', 'error.url.not.found')
            break

          default:
            if (typeof data === 'string' && data !== '') {
              addErrorAlert(data)
            } else {
              toast({
                position: 'top',
                title: data?.message || data?.error || data?.title || 'Unknown error!',
                status: 'error',
                duration: 4000,
                isClosable: true
              })
            }
        }
      }
    } else if (
      error.config && error.config.url === 'api/account' && error.config.method === 'get'
    ) {
      /* eslint-disable no-console */
      console.log('Authentication Error: Trying to access url api/account with GET.')
    } else {
      toast({
        position: 'top',
        title: error.message || 'Unknown error!',
        status: 'error',
        duration: 4000,
        isClosable: true
      })
    }
  } else if (error) {
    toast({
      position: 'top',
      title: error.message || 'Unknown error!',
      status: 'error',
      duration: 4000,
      isClosable: true
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return next(action)
}
