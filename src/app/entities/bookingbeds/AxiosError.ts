import * as S from '@effect/schema/Schema'

export const AxiosError = S.struct({
  code: S.literal('ERR_BAD_REQUEST'),
  message: S.string,
  name: S.string,
  response: S.struct({ data: S.struct({ raison: S.string }), status: S.number })
})

export type AxiosError = S.Schema.To<typeof AxiosError>
