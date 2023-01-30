import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit'
import { defaultValue, IReservation } from 'app/shared/model/reservation.model'
import {
  createEntitySlice,
  EntityState,
  serializeAxiosError
} from 'app/shared/reducers/reducer.utils'
import { cleanEntity } from 'app/shared/util/entity-utils'
import axios from 'axios'

const initialState: EntityState<IReservation> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  updating: false,
  updateSuccess: false
}

const apiUrl = 'api/reservations'
const apiUrlReservationsToBeProcessed = 'api/reservations/to-be-processed'
const apiUrlIntermittentReservations = 'api/reservations/user-id'
// Actions

export const getEntities = createAsyncThunk(
  'reservation/fetch_entity_list',
  async () => {
    const requestUrl = `${apiUrl}?cacheBuster=${new Date().getTime()}`
    return axios.get<IReservation[]>(requestUrl)
  }
)

export const getReservationsToBeProcessed = createAsyncThunk(
  'reservation/fetch_entity_list',
  async () => {
    const requestUrl = `${apiUrlReservationsToBeProcessed}?cacheBuster=${new Date().getTime()}`
    return axios.get<IReservation[]>(requestUrl)
  }
)

export const getIntermittentReservations = createAsyncThunk(
  'reservation/fetch_entity_list',
  async (id: number) => {
    const requestUrl = `${apiUrlIntermittentReservations}/${id}`
    return axios.get<IReservation[]>(requestUrl)
  }
)

export const getEntity = createAsyncThunk(
  'reservation/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`
    return axios.get<IReservation>(requestUrl)
  },
  { serializeError: serializeAxiosError }
)

export const createEntity = createAsyncThunk(
  'reservation/create_entity',
  async (entity: IReservation, thunkAPI) => {
    const result = await axios.post<IReservation>(apiUrl, cleanEntity(entity))
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const updateEntity = createAsyncThunk(
  'reservation/update_entity',
  async (entity: IReservation, thunkAPI) => {
    const result = await axios.put<IReservation>(`${apiUrl}/${entity.id}`, cleanEntity(entity))
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const partialUpdateEntity = createAsyncThunk(
  'reservation/partial_update_entity',
  async (entity: IReservation, thunkAPI) => {
    const result = await axios.patch<IReservation>(`${apiUrl}/${entity.id}`, cleanEntity(entity))
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const deleteEntity = createAsyncThunk(
  'reservation/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`
    const result = await axios.delete<IReservation>(requestUrl)
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

export const { reset } = ReservationSlice.actions

// Reducer
export default ReservationSlice.reducer
