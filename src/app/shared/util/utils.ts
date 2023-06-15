import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'

export const getParamId = (id: string | undefined) => pipe(id, O.fromNullable, O.map(Number))
