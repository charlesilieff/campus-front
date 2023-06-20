import { pipe } from '@effect/data/Function'
import * as PR from '@effect/schema/ParseResult'
import * as S from '@effect/schema/Schema'

export const FormatLocalDate: S.Schema<string, Date> = S.transform(
  S.string,
  S.ValidDateFromSelf,
  // define a function that converts a string into a Date
  s => new Date(s) instanceof Date ? new Date(s) : PR.failure(PR.type(S.Date.ast, s)),
  // define a function that converts a Date into a string
  b => pipe(b, S.encode(S.ValidDateFromSelf), b => b.toISOString().slice(0, 10))
)
