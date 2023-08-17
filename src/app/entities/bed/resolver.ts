import * as AST from '@effect/schema/AST'
import type * as ParseResult from '@effect/schema/ParseResult'
import * as Schema from '@effect/schema/Schema'
import { pipe, Predicate } from 'effect'
import { ReadonlyRecord as RR } from 'effect'
import { Either as E } from 'effect'
import { Option as O } from 'effect'
import { ReadonlyArray as A } from 'effect'
import { apply } from 'effect/Function'
import * as Match from 'effect/match'

type Entry = [string, { readonly message: string }]

const getMessage = AST.getAnnotation<AST.MessageAnnotation<unknown>>(AST.MessageAnnotationId)
const getExamples = AST.getAnnotation<AST.ExamplesAnnotation>(AST.MessageAnnotationId)

const buildError = (error: ParseResult.ParseErrors, path = [] as string[]): Array<Entry> =>
  pipe(
    Match.value(error),
    Match.tag('Key', e => A.flatMap(e.errors, _ => buildError(_, A.append(path, String(e.key))))),
    Match.tag(
      'Index',
      e => A.flatMap(e.errors, _ => buildError(_, A.append(path, String(e.index))))
    ),
    Match.tag('UnionMember', e => A.flatMap(e.errors, _ => buildError(_, path))),
    Match.tag('Type', _ => [
      [A.join([_.expected.annotations['@effect/schema/TitleAnnotationId'] as string], '.'), {
        message: pipe(
          _.message,
          O.orElse(() => O.map(getMessage(_.expected), apply(_.actual))),
          O.orElse(() =>
            pipe(
              getExamples(_.expected),
              O.filter(A.every(Predicate.isString)),
              O.map(A.join(', '))
            )
          ),
          O.getOrElse(() => `Unexpected value: ${_.actual}`)
        )
      }] as Entry
    ]),
    Match.tag('Missing', _ => [[A.join(path, '.'), { message: 'Missing' }] as Entry]),
    Match.tag('Forbidden', _ => [[A.join(path, '.'), { message: 'Forbidden' }] as Entry]),
    Match.tag(
      'Unexpected',
      _ => [[A.join(path, '.'), { message: `Unexpected value: ${_.actual}` }] as Entry]
    ),
    Match.exhaustive
  )

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const schemaResolver = <I, A,>(schema: Schema.Schema<I, A>) => (data: I, _context: any) =>
  pipe(
    Schema.decodeEither(schema)(data, { errors: 'all' }),
    E.match({
      onLeft: ({ errors }) => ({
        values: {},
        errors: RR.fromEntries(A.flatMap(errors, e => buildError(e)))
      }),
      onRight: values => ({ values, errors: {} })
    })
  )
