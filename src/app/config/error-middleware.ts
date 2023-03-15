/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable import/no-default-export */
const getErrorMessage = (errorData: { message: any; fieldErrors: any[] }) => {
  let message = errorData.message
  if (errorData.fieldErrors) {
    errorData.fieldErrors.forEach(fErr => {
      message += `\nfield: ${fErr.field},  Object: ${fErr.objectName}, message: ${fErr.message}\n`
    })
  }
  return message
}

export default () => (next: (arg0: any) => any) => (action: any) => {
  /**
   * The error middleware serves to log error messages from dispatch
   * It need not run in production
   */
  if (process.env.NODE_ENV === 'development') {
    const { error } = action
    if (error) {
      console.error(
        `${action.type} caught at middleware with reason: ${JSON.stringify(error.message)}.`
      )
      if (error && error.response && error.response.data) {
        const message = getErrorMessage(error.response.data)
        console.error(`Actual cause: ${message}`)
      }
    }
  }
  // Dispatch initial action
  return next(action)
}
