/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

interface IErrorBoundaryProps {
  readonly children: React.ReactNode
}

interface IErrorBoundaryState {
  readonly error: string
  readonly errorInfo: { componentStack: string }
}

export class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
  // @ts-expect-error TODO: fix this
  readonly state: IErrorBoundaryState = { error: undefined, errorInfo: undefined }

  componentDidCatch(error: any, errorInfo: any) {
    this.setState({
      error,
      errorInfo
    })
  }

  render() {
    const { error, errorInfo } = this.state
    const DEVELOPMENT = process.env.NODE_ENV
    if (errorInfo) {
      const errorDetails = DEVELOPMENT ?
        (
          <details className="preserve-space">
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
              error && error.toString()
            }
            <br />
            {errorInfo.componentStack}
          </details>
        ) :
        undefined
      return (
        <div>
          <h2 className="error">An unexpected error has occurred.</h2>
          {errorDetails}
        </div>
      )
    }
    return this.props.children
  }
}
