import { createAsyncThunk, isFulfilled, isPending, PayloadAction } from '@reduxjs/toolkit'
import { defaultValue, IBookingBeds } from 'app/shared/model/bookingBeds.model'
import { IReservation } from 'app/shared/model/reservation.model'
import {
  createEntitySlice,
  EntityState,
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
const apiUrl = 'api/reservations'
// Actions

export const getEntities = createAsyncThunk(
  'reservation/fetch_entity_list',
  async () => {
    const requestUrl = `${apiUrl}?cacheBuster=${new Date().getTime()}`
    return axios.get<IReservation[]>(requestUrl)
  }
)

export const getEntity = createAsyncThunk(
  'bookingBeds/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`
    return axios.get<IReservation>(requestUrl)
  },
  { serializeError: serializeAxiosError }
)

export const createEntity = createAsyncThunk(
  'bookingBeds/create_entity',
  async (entity: IReservation) => {
    const result = await axios.post<IBookingBeds>(apiUrlBookingBeds, cleanEntity(entity))
    // thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const createIntermittentReservation = createAsyncThunk(
  'bookingBeds/create_entity',
  async (entity: IReservation) => {
    const result = await axios.post<IBookingBeds>(apiUrlBookingBeds, cleanEntity(entity))

    return result
  },
  { serializeError: serializeAxiosError }
)

export const updateEntity = createAsyncThunk(
  'bookingBeds/update_entity',
  async (entity: IReservation) => {
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
  async (entity: IReservation) => {
    const result = await axios.patch<IBookingBeds>(`${apiUrl}/${entity.id}`, cleanEntity(entity))
    // thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const deleteEntity = createAsyncThunk(
  'bookingBeds/delete_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrlBookingBeds}/${id}`
    const result = await axios.delete<IReservation>(requestUrl)
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
    setData(state, action: PayloadAction<IReservation>) {
      state.entity = {
        ...state.entity,
        ...action.payload
      }
      state.stepOne = true
      state.creating = true
    },
    backToOne(state, action: PayloadAction<IReservation>) {
      state.stepOne = false
      state.entity = {
        ...state.entity,
        ...action.payload
      }
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getEntity.fulfilled, (state, action) => {
        state.loading = false
        state.entity = action.payload.data
      })
      .addCase(deleteEntity.fulfilled, state => {
        state.updating = false
        state.updateSuccess = true
        state.entity = {}
      })
      .addMatcher(isFulfilled(getEntities), (state, action) => ({
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
      .addMatcher(isPending(getEntities, getEntity), state => {
        state.errorMessage = null
        state.updateSuccess = false
        state.loading = true
      })
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
export default BookingBedsSlice.reducer
