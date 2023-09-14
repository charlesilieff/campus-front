import * as S from '@effect/schema/Schema'
import type { CustomerDecoded, CustomerEncoded } from 'app/shared/model/customer.model'
import { Customer } from 'app/shared/model/customer.model'
import type { Pricing } from 'app/shared/model/pricing.model'
import dayjs from 'dayjs'
import { type Option as O, pipe } from 'effect'

export interface DatesAndMealsEncoded {
  id?: number
  personNumber: number
  paymentMode?: string
  reservationNumber?: string
  specialDietNumber: number
  isArrivalDinner: boolean
  isDepartureDinner: boolean
  isArrivalLunch: boolean
  isDepartureLunch: boolean
  arrivalDate: Date
  departureDate: Date
  comment?: string
  pricing?: Pricing
  customer?: CustomerEncoded
  userCategoryId?: number
  isArrivalBreakfast: boolean
  isDepartureBreakfast: boolean
  commentMeals?: string
}

export interface DatesAndMealsDecoded {
  id: O.Option<number>
  personNumber: number
  paymentMode: O.Option<string>
  reservationNumber: O.Option<string>
  specialDietNumber: number
  isArrivalDinner: boolean
  isDepartureDinner: boolean
  isArrivalLunch: boolean
  isDepartureLunch: boolean
  arrivalDate: Date
  departureDate: Date
  comment: O.Option<string>
  customer: O.Option<CustomerDecoded>
  userCategoryId: O.Option<number>
  isArrivalBreakfast: boolean
  isDepartureBreakfast: boolean
  commentMeals: O.Option<string>
}

export const DatesAndMeals: S.Schema<DatesAndMealsEncoded, DatesAndMealsDecoded> = pipe(
  S.struct({
    id: S.optional(S.number).toOption(),
    personNumber: pipe(
      S.number,
      S.positive({
        title: 'personNumber',
        message: () => 'Le nombre de personne doit être strictement positif.'
      })
    ),
    paymentMode: S.optional(S.string).toOption(),
    reservationNumber: S.optional(S.UUID).toOption(),
    specialDietNumber: pipe(
      S.number,
      S.filter(n => n >= 0, {
        title: 'specialDietNumber',
        message: () => 'Le nombre de régime doit être positif'
      })
    ),
    isArrivalDinner: S.boolean,
    isDepartureDinner: S.boolean,
    isArrivalLunch: S.boolean,
    isDepartureLunch: S.boolean,
    arrivalDate: pipe(
      S.DateFromSelf,
      S.filter(d => dayjs(d).add(1, 'day').isAfter(dayjs()), {
        title: 'arrivalDate',
        message: () => "La date d'arrivée doit être supérieure à la date du jour."
      })
    ),
    departureDate: S.DateFromSelf,
    comment: S.optional(S.string).toOption(),
    // pricing: S.optional(S.lazy(() => Pricing)).toOption(),
    customer: S.optional(S.lazy(() => Customer)).toOption(),
    // userCategory: S.optional(S.lazy(() => UserCategory)).toOption(),
    userCategoryId: S.optional(S.number).toOption(),
    isArrivalBreakfast: S.boolean,
    isDepartureBreakfast: S.boolean,
    commentMeals: S.optional(S.string).toOption()
  }),
  S.filter(d => d.arrivalDate <= d.departureDate, {
    title: 'arrivalDate',
    message: input =>
      `La date d'arrivée doit être avant la date de départ: ${input.departureDate.toLocaleDateString()}.`
  }),
  S.filter(d => d.personNumber >= d.specialDietNumber, {
    title: 'specialDietNumber',
    message: input =>
      `Le nombre de personnes doit être supérieur ou égal au nombre de régimes spéciaux: ${input.personNumber}.`
  })
)

export type DatesAndMeals = S.Schema.To<typeof DatesAndMeals>
