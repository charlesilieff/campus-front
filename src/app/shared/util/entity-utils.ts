/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import * as R from '@effect/data/ReadonlyRecord'
import pick from 'lodash/pick'

/**
 * Removes fields with an 'id' field that equals ''.
 * This function was created to prevent entities to be sent to
 * the server with an empty id and thus resulting in a 500.
 *
 * @param entity Object to clean.
 */
export const cleanEntity = (entity: Record<string, any>) => {
  const keysToKeep = Object.keys(entity).filter(k =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    !(entity[k] instanceof Object) || (entity[k]['id'] !== '' && entity[k]['id'] !== -1)
  )

  return pipe(
    pick(entity, keysToKeep),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    R.map(value => O.isOption(value) ? O.getOrUndefined(value) : value)
  )
}

/**
 * Simply map a list of element to a list a object with the element as id.
 *
 * @param idList Elements to map.
 * @returns The list of objects with mapped ids.
 */
export const mapIdList = (idList: readonly any[]) =>
  idList.filter((id: any) => id !== '').map((id: string | number) => ({ id }))
