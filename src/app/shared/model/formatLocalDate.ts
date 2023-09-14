import * as PR from '@effect/schema/ParseResult'
import * as S from '@effect/schema/Schema'
import dayjs from 'dayjs'
import { pipe } from 'effect'

export const FormatLocalDate: S.Schema<string, Date> = S.transformOrFail(
  S.string,
  S.ValidDateFromSelf,
  // define a function that converts a string into a Date
  s => new Date(s) instanceof Date ? PR.success(new Date(s)) : PR.failure(PR.type(S.Date.ast, s)),
  // define a function that converts a Date into a string

  b => PR.success(pipe(b, S.encodeSync(S.ValidDateFromSelf), b => b.toISOString().slice(0, 10)))
)

export const FormatLocalDateTime: S.Schema<string, Date> = S.transformOrFail(
  S.string,
  S.ValidDateFromSelf,
  // define a function that converts a string into a Date
  s => new Date(s) instanceof Date ? PR.success(new Date(s)) : PR.failure(PR.type(S.Date.ast, s)),
  // define a function that converts a Date into a string

  b =>
    PR.success(
      pipe(b, S.encodeSync(S.ValidDateFromSelf), b => dayjs(b).format('YYYY-MM-DDTHH:mm:ss'))
    )
)
