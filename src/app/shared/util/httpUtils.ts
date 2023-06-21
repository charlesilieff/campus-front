import { pipe } from '@effect/data/Function'
import type * as O from '@effect/data/Option'
import * as T from '@effect/io/Effect'
import * as S from '@effect/schema/Schema'
import { formatErrors } from '@effect/schema/TreeFormatter'
import axios from 'axios'
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
        S.parseEffect(schema)(d.data),
        T.mapError(e => formatErrors(e.errors)),
        T.tapError(d => T.logError(d)),
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
    T.flatMap(d => S.parseEffect(S.array(schema))(d.data)),
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
    S.encodeEffect(schema)(entity, { errors: 'all' }),
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
  responseType: S.Schema<C, D>
): Promise<WritableDraft<O.Option<D>>> =>
  pipe(
    S.encodeEffect(schema)(entity),
    T.mapError(e => formatErrors(e.errors)),
    T.flatMap(b => T.promise(() => axios.post(url, b))),
    T.map(d => S.parseOption(responseType)(d.data)),
    T.map(d => castDraft(d)),
    T.runPromise
  )
