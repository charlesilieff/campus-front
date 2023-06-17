import * as O from '@effect/data/Option'
import * as S from '@effect/schema/Schema'

export interface PlaceEncoded {
  id: number
  name: string
  comment?: string
  imageContentType?: string
  image?: string
}

export interface PlaceDecoded {
  id: number
  name: string
  comment: O.Option<string>
  imageContentType: O.Option<string>
  image: O.Option<string>
}

export const Place: S.Schema<PlaceEncoded, PlaceDecoded> = S.lazy(() =>
  S.struct({
    id: S.number,
    name: S.string,
    comment: S.optional(S.string).toOption(),
    imageContentType: S.optional(S.string).toOption(),
    image: S.optional(S.string).toOption()
  })
)

// export interface IPlace {
//   id?: number
//   name?: string
//   comment?: string | null
//   imageContentType?: string | null
//   image?: string | null
//   rooms?: IRoom[] | null
//   intermittentAllowed?: boolean
// }

export type Place = S.To<typeof Place>

export const defaultValue: Readonly<O.Option<Place>> = O.none()
