/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
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

  return pick(entity, keysToKeep)
}

/**
 * Simply map a list of element to a list a object with the element as id.
 *
 * @param idList Elements to map.
 * @returns The list of objects with mapped ids.
 */
export const mapIdList = (idList: readonly any[]) =>
  idList.filter((id: any) => id !== '').map((id: any) => ({ id }))
