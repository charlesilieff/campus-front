/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint no-console: off */
// eslint-disable-next-line import/no-default-export
export default () => (next: (arg0: any) => any) => (action: any) => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { type, payload, meta, error } = action

    console.groupCollapsed(type)
    console.log('Payload:', payload)
    if (error) {
      console.log('Error:', error)
    }
    console.log('Meta:', meta)
    console.groupEnd()
  }

  return next(action)
}
