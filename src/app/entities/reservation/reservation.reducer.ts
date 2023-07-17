import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit'
import { Reservation } from 'app/shared/model/reservation.model'
import type {
  EntityState
} from 'app/shared/reducers/reducer.utils'
import {
  createEntitySlice,
  serializeAxiosError
} from 'app/shared/reducers/reducer.utils'
import { getHttpEntities, getHttpEntity } from 'app/shared/util/httpUtils'
import axios from 'axios'
import { Option as O } from 'effect'
import { castDraft } from 'immer'

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

    return getHttpEntities(requestUrl, Reservation)
  }
)

export const getReservationsToBeProcessed = createAsyncThunk(
  'reservation/fetch_entity_list',
  async () => {
    const requestUrl = `${apiUrlReservationsToBeProcessed}`

    return getHttpEntities(requestUrl, Reservation)
  }
)

export const getOneBedUserReservationsByUserId = createAsyncThunk(
  'reservation/fetch_entity_list',
  async (id: number) => {
    const requestUrl = `${apiUrlOneBedUserReservations}/${id}`

    return getHttpEntities(requestUrl, Reservation)
  }
)

export const getReservation = createAsyncThunk(
  'reservation/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`
    return getHttpEntity(requestUrl, Reservation)
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
        state.entity = action.payload
      })
      .addCase(deleteEntity.fulfilled, state => {
        state.updating = false
        state.updateSuccess = true
        state.entity = castDraft(O.none())
      })
      .addMatcher(isFulfilled(getEntities, getOneBedUserReservationsByUserId), (state, action) => ({
        ...state,
        loading: false,
        entities: action.payload
      }))
      .addMatcher(isPending(getEntities, getReservation), state => {
        state.errorMessage = null
        state.updateSuccess = false
        state.loading = true
      })
      .addMatcher(
        isPending(deleteEntity),
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
