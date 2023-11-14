import * as Match from '@effect/match'
import * as AST from '@effect/schema/AST'
import type * as ParseResult from '@effect/schema/ParseResult'
import * as Schema from '@effect/schema/Schema'
import { Either as E, Option as O, pipe, ReadonlyArray as A, ReadonlyRecord as RR } from 'effect'
import { apply } from 'effect/Function'

type Entry = [string, { readonly message: string }]

const getMessage = AST.getAnnotation<AST.MessageAnnotation<unknown>>(AST.MessageAnnotationId)
const matchError = Match.typeTags<ParseResult.ParseErrors>()

const buildError = (error: ParseResult.ParseErrors, path = [] as string[]): Array<Entry> =>
  pipe(
    error,
    matchError({
      Key: e => A.flatMap(e.errors, _ => buildError(_, A.append(path, String(e.key)))),
      Index: e => A.flatMap(e.errors, _ => buildError(_, A.append(path, String(e.index)))),
      UnionMember: e => A.flatMap(e.errors, _ => buildError(_, path)),
      Type: _ => [
        [
          A.join(path, '.'),
          {
            message: pipe(
              _.message,
              O.orElse(() => O.map(getMessage(_.expected), apply(_.actual))),
              O.getOrElse(() => pipe(O.getOrElse(() => `Unexpected value: ${_.actual}`)))
            )
          }
        ] as Entry
      ],
      Missing: _ => [[A.join(path, '.'), { message: 'Missing' }] as Entry],
      Forbidden: _ => [[A.join(path, '.'), { message: 'Forbidden' }] as Entry],
      Unexpected: _ => [[A.join(path, '.'), { message: `Unexpected value: ${_.actual}` }] as Entry]
    })
  )

export const schemaResolver = <I, A,>(schema: Schema.Schema<I, A>) =>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(data: I, _context: any) =>
  pipe(
    Schema.decodeEither(schema)(data, { errors: 'all' }),
    E.match({
      onLeft({ errors }) {
        return {
          values: {},
          errors: RR.fromEntries(A.flatMap(errors, _ => buildError(_)))
        }
      },
      onRight: values => ({ values, errors: {} })
    })
  )
