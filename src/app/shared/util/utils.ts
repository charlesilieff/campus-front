import { Option as O } from 'effect'
import { pipe } from 'effect'

export const getParamId = (id: string | undefined) => pipe(id, O.fromNullable, O.map(Number))
