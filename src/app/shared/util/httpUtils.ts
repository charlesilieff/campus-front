import * as S from '@effect/schema/Schema'
import { formatErrors } from '@effect/schema/TreeFormatter'
import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import type { Option as O } from 'effect'
import { Effect as T } from 'effect'
import { pipe } from 'effect'
import { castDraft } from 'immer'
import type { WritableDraft } from 'immer/dist/internal'

export const getHttpEntity = <A, B,>(
  url: string,
  schema: S.Schema<B, A>
): Promise<WritableDraft<O.Option<A>>> =>
  pipe(
    T.promise(() => axios.get(url)),
    T.flatMap(d =>
      pipe(
        S.parseResult(schema)(d.data),
        T.mapError(e => formatErrors(e.errors)),
        T.tapError(d => T.log(d, 'Error')),
        T.option
      )
    ),
    T.map(d => castDraft(d)),
    T.runPromise
  )

export const getHttpEntities = <A, B,>(
  url: string,
  schema: S.Schema<B, A>
): Promise<WritableDraft<readonly A[]>> =>
  pipe(
    T.promise(() => axios.get(url)),
    T.flatMap(d => S.parseResult(S.array(schema))(d.data)),
    T.mapError(e => formatErrors(e.errors)),
    T.map(d => castDraft(d)),
    T.runPromise
  )

export const putHttpEntity = <A, B, C, D,>(
  url: string,
  schema: S.Schema<A, B>,
  entity: B,
  responseType: S.Schema<C, D>
): Promise<WritableDraft<O.Option<D>>> =>
  pipe(
    S.encodeResult(schema)(entity, { errors: 'all' }),
    T.mapError(e => formatErrors(e.errors)),
    T.flatMap(b => T.promise(() => axios.put(url, b))),
    T.map(d => S.parseOption(responseType)(d.data)),
    T.map(d => castDraft(d)),
    T.runPromise
  )

export const postHttpEntity = <A, B, C, D,>(
  url: string,
  schema: S.Schema<A, B>,
  entity: B,
  responseType: S.Schema<C, D>,
  config?: AxiosRequestConfig<A> | undefined
): Promise<WritableDraft<O.Option<D>>> => {
  console.log('postHttpEntity', url, schema, entity, responseType, config)
  return pipe(
    S.encodeResult(schema)(entity),
    T.mapError(e => formatErrors(e.errors)),
    T.flatMap(b => T.promise(() => axios.post(url, b, config))),
    T.map(d => S.parseOption(responseType)(d.data)),
    T.map(d => castDraft(d)),
    T.runPromise
  )
}
