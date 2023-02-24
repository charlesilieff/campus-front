import { Alert } from '@chakra-ui/react'
import React from 'react'

export class PageNotFound extends React.Component {
  render() {
    return (
      <div>
        <Alert status="error">The page does not exist.</Alert>
      </div>
    )
  }
}
