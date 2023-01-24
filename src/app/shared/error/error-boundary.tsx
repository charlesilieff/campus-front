import React from 'react'

interface IErrorBoundaryProps {
  readonly children: React.ReactNode
}

interface IErrorBoundaryState {
  readonly error: any
  readonly errorInfo: any
}

export class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
  readonly state: IErrorBoundaryState = { error: undefined, errorInfo: undefined }

  componentDidCatch(error, errorInfo) {
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
            {error && error.toString()}
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
