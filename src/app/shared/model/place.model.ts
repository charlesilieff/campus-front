import * as S from '@effect/schema/Schema'
import { Option as O } from 'effect'

export interface PlaceEncoded {
  id: number
  name: string
  comment?: string
  imageContentType?: string
  image?: string
  intermittentAllowed?: boolean
}

export interface PlaceDecoded {
  id: number
  name: string
  comment: O.Option<string>
  imageContentType: O.Option<string>
  image: O.Option<string>
  intermittentAllowed: O.Option<boolean>
}

export const Place: S.Schema<PlaceEncoded, PlaceDecoded> = S.struct({
  id: S.number,
  name: S.string,
  comment: S.optional(S.string).toOption(),
  imageContentType: S.optional(S.string).toOption(),
  image: S.optional(S.string).toOption(),
  intermittentAllowed: S.optional(S.boolean).toOption()
})

export type Place = S.Schema.To<typeof Place>

export const defaultValue: Readonly<O.Option<Place>> = O.none()

export const PlaceNoImage = S.struct({
  id: S.number,
  name: S.string,
  comment: S.optional(S.string).toOption(),
  intermittentAllowed: S.optional(S.boolean).toOption()
})
export interface PlaceNoImage {
  id: number
  name: string
  comment: O.Option<string>
  intermittentAllowed: O.Option<boolean>
}
