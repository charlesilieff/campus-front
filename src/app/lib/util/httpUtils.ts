import { pipe } from '@effect/data/Function'
import type * as O from '@effect/data/Option'
import * as T from '@effect/io/Effect'
import * as S from '@effect/schema/Schema'
import { formatErrors } from '@effect/schema/TreeFormatter'
import axios from 'axios'

export const getHttpEntity = <A, B,>(url: string, schema: S.Schema<B, A>): Promise<O.Option<A>> =>
  pipe(
    T.promise(() => axios.get(url)),
    T.map(d => S.parseOption(schema)(d.data)),
    T.runPromise
  )

export const getHttpEntities = <A, B,>(
  url: string,
  schema: S.Schema<B, A>
): Promise<readonly A[]> =>
  pipe(
    T.promise(() => axios.get(url)),
    T.flatMap(d => S.parseEffect(S.array(schema))(d.data, { errors: 'all' })),
    T.mapError(e => {
      console.log(formatErrors(e.errors))
      return formatErrors(e.errors)
    }),
    T.runPromise
  )

export const putHttpEntity = <A, B, C, D,>(
  url: string,
  schema: S.Schema<B, A>,
  entity: A,
  responseType: S.Schema<C, D>
): Promise<O.Option<D>> =>
  pipe(
    S.encodeEffect(schema)(entity),
    T.mapError(e => formatErrors(e.errors)),
    T.flatMap(b => T.promise(() => axios.put(url, b))),
    T.map(d => S.parseOption(responseType)(d.data)),
    T.runPromise
  )

export const postHttpEntity = <A, B, C, D,>(
  url: string,
  schema: S.Schema<B, A>,
  entity: A,
  responseType: S.Schema<C, D>
): Promise<O.Option<D>> =>
  pipe(
    S.encodeEffect(schema)(entity),
    T.mapError(e => formatErrors(e.errors)),
    T.flatMap(b => T.promise(() => axios.post(url, b))),
    T.map(d => S.parseOption(responseType)(d.data)),
    T.runPromise
  )
