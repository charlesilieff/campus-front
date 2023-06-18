import * as O from '@effect/data/Option'
import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit'
import type { Reservation } from 'app/shared/model/reservation.model'
import type {
  EntityState
} from 'app/shared/reducers/reducer.utils'
import {
  createEntitySlice,
  serializeAxiosError
} from 'app/shared/reducers/reducer.utils'
import { cleanEntity } from 'app/shared/util/entity-utils'
import axios from 'axios'

const initialState: EntityState<Reservation> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: O.none(),
  updating: false,
  updateSuccess: false
}

const apiUrl = 'api/reservations'
const apiUrlReservationsToBeProcessed = 'api/reservations-to-be-processed'
const apiUrlOneBedUserReservations = 'api/reservations/user-id'

// Actions

export const getEntities = createAsyncThunk(
  'reservation/fetch_entity_list',
  async () => {
    const requestUrl = `${apiUrl}`
    return axios.get<Reservation[]>(requestUrl)
  }
)

export const getReservationsToBeProcessed = createAsyncThunk(
  'reservation/fetch_entity_list',
  async () => {
    const requestUrl = `${apiUrlReservationsToBeProcessed}`
    return axios.get<Reservation[]>(requestUrl)
  }
)

export const getOneBedUserReservationsByUserId = createAsyncThunk(
  'reservation/fetch_entity_list',
  async (id: number) => {
    const requestUrl = `${apiUrlOneBedUserReservations}/${id}`
    return axios.get<Reservation[]>(requestUrl)
  }
)

export const getReservation = createAsyncThunk(
  'reservation/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`
    return axios.get<Reservation>(requestUrl)
  },
  { serializeError: serializeAxiosError }
)

export const createEntity = createAsyncThunk(
  'reservation/create_entity',
  async (entity: Reservation, thunkAPI) => {
    const result = await axios.post<Reservation>(apiUrl, cleanEntity(entity))
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const updateEntity = createAsyncThunk(
  'reservation/update_entity',
  async (entity: Reservation, thunkAPI) => {
    const result = await axios.put<Reservation>(`${apiUrl}/${entity.id}`, cleanEntity(entity))
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const partialUpdateEntity = createAsyncThunk(
  'reservation/partial_update_entity',
  async (entity: Reservation, thunkAPI) => {
    const result = await axios.patch<Reservation>(`${apiUrl}/${entity.id}`, cleanEntity(entity))
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const deleteEntity = createAsyncThunk(
  'reservation/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`
    const result = await axios.delete<Reservation>(requestUrl)
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

// slice

export const ReservationSlice = createEntitySlice({
  name: 'reservation',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(getReservation.fulfilled, (state, action) => {
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
      })
      .addMatcher(isPending(getEntities, getReservation), state => {
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

export const { reset } = ReservationSlice.actions

// Reducer
// eslint-disable-next-line import/no-default-export
export default ReservationSlice.reducer
