import * as S from '@effect/schema/Schema'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit'
import { ReservationCreateSchemaWithBedIds,
  ReservationSchemaWithBedIds } from 'app/shared/model/bookingBeds.model'
import { OneBedUserReservation } from 'app/shared/model/onebedReservation.model'
import type {
  EntityState
} from 'app/shared/reducers/reducer.utils'
import {
  createEntitySlice,
  serializeAxiosError
} from 'app/shared/reducers/reducer.utils'
import { getHttpEntity, postHttpEntity, putHttpEntity } from 'app/shared/util/httpUtils'
import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { Option as O } from 'effect'
import { pipe } from 'effect'
import { castDraft } from 'immer'

const initialState: EntityState<ReservationCreateSchemaWithBedIds> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: O.none(),
  updating: false,
  updateSuccess: false,
  stepOne: false,
  creating: false
}

const apiUrlBookingBeds = 'api/bookingbeds'
const apiUrlReservations = 'api/reservations'
const apiUrlOneBedUserReservation = 'api/one-bed-with-user/bookingbeds'

// Actions

export const getReservationsWithBedEntity = createAsyncThunk(
  'bookingBeds/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrlReservations}/${id}`
    return getHttpEntity(requestUrl, ReservationCreateSchemaWithBedIds)
  },
  { serializeError: serializeAxiosError }
)

export const getReservationsWithBedIdsEntity = createAsyncThunk(
  'bookingBeds/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrlBookingBeds}/${id}`
    return getHttpEntity(requestUrl, ReservationCreateSchemaWithBedIds)
  },
  { serializeError: serializeAxiosError }
)

const ReservationAndSendMailSchema = S.struct({
  entity: ReservationCreateSchemaWithBedIds,
  sendMail: S.boolean
})
type ReservationAndSendMail = S.To<typeof ReservationAndSendMailSchema>

export const createEntity = createAsyncThunk(
  'bookingBeds/create_entity',
  async (reservationAndSendMail: ReservationAndSendMail) =>
    await postHttpEntity(
      apiUrlBookingBeds,
      ReservationCreateSchemaWithBedIds,
      reservationAndSendMail.entity,
      ReservationCreateSchemaWithBedIds,
      { params: { sendMail: reservationAndSendMail.sendMail } }
    ),
  { serializeError: serializeAxiosError }
)

interface ReservationAndSendMailAndUpdateUser {
  entity: ReservationCreateSchemaWithBedIds
  sendMail: boolean
  userId: number
}
export const createReservationAndUpdateUser = createAsyncThunk(
  'bookingBeds/create_entity',
  async (reservationAndSendMailAndUpdateUser: ReservationAndSendMailAndUpdateUser) => {
    const requestUrl = `${apiUrlBookingBeds}/${reservationAndSendMailAndUpdateUser.userId}`
    const result = await postHttpEntity(
      requestUrl,
      ReservationCreateSchemaWithBedIds,
      reservationAndSendMailAndUpdateUser.entity,
      ReservationCreateSchemaWithBedIds,
      {
        params: { sendMail: reservationAndSendMailAndUpdateUser.sendMail }
      }
    )

    return result
  },
  { serializeError: serializeAxiosError }
)

export const createOneBedUserReservationUpdateUser = createAsyncThunk(
  'bookingBeds/create_entity',
  async (intermittentReservation: OneBedUserReservation) => {
    const requestUrl = `${apiUrlOneBedUserReservation}`
    return await postHttpEntity(
      requestUrl,
      OneBedUserReservation,
      intermittentReservation,
      OneBedUserReservation
    )
  },
  { serializeError: serializeAxiosError }
)

export const createReservationWithoutMealsAndUpdateUser = createAsyncThunk(
  'bookingBeds/create_entity',
  async (reservationAndSendMailAndUpdateUser: ReservationAndSendMailAndUpdateUser) => {
    const requestUrl = `${apiUrlBookingBeds}/meals/${reservationAndSendMailAndUpdateUser.userId}`
    return await postHttpEntity(
      requestUrl,
      ReservationCreateSchemaWithBedIds,
      reservationAndSendMailAndUpdateUser.entity,
      S.string,
      {
        params: { sendMail: reservationAndSendMailAndUpdateUser.sendMail }
      }
    )
  },
  { serializeError: serializeAxiosError }
)

export const updateEntity = createAsyncThunk(
  'bookingBeds/update_entity',
  async (entity: ReservationSchemaWithBedIds) =>
    await putHttpEntity(
      `${apiUrlBookingBeds}/${entity.id}`,
      ReservationSchemaWithBedIds,
      entity,
      ReservationSchemaWithBedIds
    ),
  { serializeError: serializeAxiosError }
)

export const updateOneBedUserReservationReservation = createAsyncThunk(
  'bookingBeds/update_entity',
  async (entity: OneBedUserReservation) =>
    await putHttpEntity(
      `${apiUrlOneBedUserReservation}/${pipe(entity.id, O.getOrElse(() => 'error'))}`,
      OneBedUserReservation,
      entity,
      OneBedUserReservation
    ),
  { serializeError: serializeAxiosError }
)

interface CancelReservationAndSendMail {
  // entity: IBookingBeds
  id: string | number
  sendMail: boolean
}

export const deleteEntity = createAsyncThunk(
  'bookingBeds/delete_entity',
  async (cancelReservationAndSendMail: CancelReservationAndSendMail) => {
    const requestUrl = `${apiUrlBookingBeds}/${cancelReservationAndSendMail.id}`
    const options: AxiosRequestConfig = {
      params: { sendMail: cancelReservationAndSendMail.sendMail }
    }
    const result = await axios.delete<ReservationSchemaWithBedIds>(
      requestUrl,
      options
    )
    return result
  },
  { serializeError: serializeAxiosError }
)

// slice
export const BookingBedsSlice = createEntitySlice({
  name: 'bookingBeds',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<ReservationSchemaWithBedIds>) {
      state.entity = {
        ...state.entity,
        ...action.payload
      }
      state.stepOne = true
      state.creating = true
    },
    backToOne(state, action: PayloadAction<ReservationSchemaWithBedIds>) {
      state.stepOne = false
      state.entity = {
        ...state.entity,
        ...action.payload
      }
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getReservationsWithBedIdsEntity.fulfilled, (state, action) => {
        state.loading = false
        state.entity = action.payload
      })
      .addCase(deleteEntity.fulfilled, state => {
        state.updating = false
        state.updateSuccess = true
        state.entity = castDraft(O.none())
      })
      .addMatcher(isFulfilled(createEntity, updateEntity), (state, action) => {
        state.updating = false
        state.loading = false
        state.updateSuccess = true
        state.entity = action.payload
        state.stepOne = false
        state.creating = false
      })
      .addMatcher(
        isPending(getReservationsWithBedIdsEntity),
        state => {
          state.errorMessage = null
          state.updateSuccess = false
          state.loading = true
        }
      )
      .addMatcher(
        isPending(createEntity, updateEntity, deleteEntity),
        state => {
          state.errorMessage = null
          state.updateSuccess = false
          state.updating = true
        }
      )
  }
})
// @ts-expect-error TODO: fix this
export const { reset, setData, backToOne } = BookingBedsSlice.actions

// Reducer
// eslint-disable-next-line import/no-default-export
export default BookingBedsSlice.reducer
