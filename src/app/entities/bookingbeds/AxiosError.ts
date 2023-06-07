import * as S from '@effect/schema/Schema'

export const AxiosError = S.struct({
  code: S.literal('ERR_BAD_REQUEST')
})

export type AxiosError = S.To<typeof AxiosError>
