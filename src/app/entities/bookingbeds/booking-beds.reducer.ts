import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit'
import type { IBookingBeds } from 'app/shared/model/bookingBeds.model'
import { defaultValue } from 'app/shared/model/bookingBeds.model'
import type { OneBedUserReservation } from 'app/shared/model/intermittentReservation.model'
import type {
  EntityState
} from 'app/shared/reducers/reducer.utils'
import {
  createEntitySlice,
  serializeAxiosError
} from 'app/shared/reducers/reducer.utils'
import { cleanEntity } from 'app/shared/util/entity-utils'
import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'

const initialState: EntityState<IBookingBeds> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
  stepOne: false,
  creating: false
}

const apiUrlBookingBeds = 'api/bookingbeds'
const apiUrlReservations = 'api/reservations'
const apiUrlIntermittentReservation = 'api/one-bed-with-user/bookingbeds'
const apiAllPlaces = 'api/all-places-with-rooms-and-beds'
// Actions

// this is not used
export const getAllPlaceWithRoomsAndBeds = createAsyncThunk(
  'reservation/fetch_entity_list',
  async () => {
    const requestUrl = `${apiAllPlaces}?cacheBuster=${new Date().getTime()}`
    return axios.get<IBookingBeds[]>(requestUrl)
  }
)

export const getReservationsWithBedEntity = createAsyncThunk(
  'bookingBeds/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrlReservations}/${id}`
    return axios.get<IBookingBeds>(requestUrl)
  },
  { serializeError: serializeAxiosError }
)

export const getReservationsWithBedIdsEntity = createAsyncThunk(
  'bookingBeds/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrlBookingBeds}/${id}`
    return axios.get<IBookingBeds>(requestUrl)
  },
  { serializeError: serializeAxiosError }
)

interface ReservationAndSendMail {
  entity: IBookingBeds
  sendMail: boolean
}

export const createEntity = createAsyncThunk(
  'bookingBeds/create_entity',
  async (reservationAndSendMail: ReservationAndSendMail) => {
    const result = await axios.post<IBookingBeds>(
      apiUrlBookingBeds,
      cleanEntity(reservationAndSendMail.entity),
      {
        params: { sendMail: reservationAndSendMail.sendMail }
      }
    )
    // thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

interface ReservationAndSendMailAndUpdateUser {
  entity: IBookingBeds
  sendMail: boolean
  userId: number
}
export const createReservationAndUpdateUser = createAsyncThunk(
  'bookingBeds/create_entity',
  async (reservationAndSendMailAndUpdateUser: ReservationAndSendMailAndUpdateUser) => {
    const requestUrl = `${apiUrlBookingBeds}/${reservationAndSendMailAndUpdateUser.userId}`
    const result = await axios.post<IBookingBeds>(
      requestUrl,
      cleanEntity(reservationAndSendMailAndUpdateUser.entity),
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
    const requestUrl = `${apiUrlIntermittentReservation}`
    const result = await axios.post<OneBedUserReservation>(
      requestUrl,
      cleanEntity(intermittentReservation)
    )

    return result
  },
  { serializeError: serializeAxiosError }
)

export const createReservationWithoutMealsAndUpdateUser = createAsyncThunk(
  'bookingBeds/create_entity',
  async (reservationAndSendMailAndUpdateUser: ReservationAndSendMailAndUpdateUser) => {
    const requestUrl = `${apiUrlBookingBeds}/meals/${reservationAndSendMailAndUpdateUser.userId}`
    const result = await axios.post<IBookingBeds>(
      requestUrl,
      cleanEntity(reservationAndSendMailAndUpdateUser.entity),
      {
        params: { sendMail: reservationAndSendMailAndUpdateUser.sendMail }
      }
    )

    return result
  },
  { serializeError: serializeAxiosError }
)

export const updateEntity = createAsyncThunk(
  'bookingBeds/update_entity',
  async (entity: IBookingBeds) => {
    const result = await axios.put<IBookingBeds>(
      `${apiUrlBookingBeds}/${entity.id}`,
      cleanEntity(entity)
    )
    return result
  },
  { serializeError: serializeAxiosError }
)

export const updateOneBedUserReservationReservation = createAsyncThunk(
  'bookingBeds/update_entity',
  async (entity: OneBedUserReservation) => {
    const result = await axios.put<OneBedUserReservation>(
      `${apiUrlIntermittentReservation}/${entity.id}`,
      cleanEntity(entity)
    )
    return result
  },
  { serializeError: serializeAxiosError }
)

export const partialUpdateEntity = createAsyncThunk(
  'bookingBeds/partial_update_entity',
  async (entity: IBookingBeds) => {
    const result = await axios.patch<IBookingBeds>(
      `${apiUrlBookingBeds}/${entity.id}`,
      cleanEntity(entity)
    )
    return result
  },
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
    const result = await axios.delete<IBookingBeds>(
      requestUrl,
      options
    )
    return result
  },
  { serializeError: serializeAxiosError }
)

// slice
// @ts-expect-error inferred type of 'BookingBedsSlice' cannot be named without
export const BookingBedsSlice = createEntitySlice({
  name: 'bookingBeds',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<IBookingBeds>) {
      state.entity = {
        ...state.entity,
        ...action.payload
      }
      state.stepOne = true
      state.creating = true
    },
    backToOne(state, action: PayloadAction<IBookingBeds>) {
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
        state.entity = action.payload.data
      })
      .addCase(deleteEntity.fulfilled, state => {
        state.updating = false
        state.updateSuccess = true
        state.entity = { bedIds: [] }
      })
      .addMatcher(isFulfilled(getAllPlaceWithRoomsAndBeds), (state, action) => ({
        ...state,
        loading: false,
        entities: action.payload.data
      }))
      .addMatcher(isFulfilled(createEntity, updateEntity, partialUpdateEntity), (state, action) => {
        state.updating = false
        state.loading = false
        state.updateSuccess = true
        state.entity = action.payload.data
        state.stepOne = false
        state.creating = false
      })
      .addMatcher(
        isPending(getAllPlaceWithRoomsAndBeds, getReservationsWithBedIdsEntity),
        state => {
          state.errorMessage = null
          state.updateSuccess = false
          state.loading = true
        }
      )
      .addMatcher(
        isPending(createEntity, updateEntity, partialUpdateEntity, deleteEntity),
        state => {
          state.errorMessage = null
          state.updateSuccess = false
          state.updating = true
        }
      )
  }
})

export const { reset, setData, backToOne } = BookingBedsSlice.actions

// Reducer
// eslint-disable-next-line import/no-default-export
export default BookingBedsSlice.reducer
