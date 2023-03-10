import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit'
import type { IBookingBeds } from 'app/shared/model/bookingBeds.model'
import { defaultValue } from 'app/shared/model/bookingBeds.model'
import type {
  EntityState
} from 'app/shared/reducers/reducer.utils'
import {
  createEntitySlice,
  serializeAxiosError
} from 'app/shared/reducers/reducer.utils'
import { cleanEntity } from 'app/shared/util/entity-utils'
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

export const createReservationAndUpdateUser = createAsyncThunk(
  'bookingBeds/create_entity',
  async ({ entity, userId }: { entity: IBookingBeds; userId: number }) => {
    const result = await axios.post<IBookingBeds>(
      `${apiUrlBookingBeds}/${userId}`,
      cleanEntity(entity)
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
    // thunkAPI.dispatch(getEntities())
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
    // thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const deleteEntity = createAsyncThunk(
  'bookingBeds/delete_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrlBookingBeds}/${id}`
    const result = await axios.delete<IBookingBeds>(requestUrl)
    // thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

// slice

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
