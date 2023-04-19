import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit'
import type { ITypeReservation } from 'app/shared/model/typeReservation.model'
import { defaultValue } from 'app/shared/model/typeReservation.model'
import type {
  EntityState
} from 'app/shared/reducers/reducer.utils'
import {
  createEntitySlice,
  serializeAxiosError
} from 'app/shared/reducers/reducer.utils'
import { cleanEntity } from 'app/shared/util/entity-utils'
import axios from 'axios'

const initialState: EntityState<ITypeReservation> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  updating: false,
  updateSuccess: false
}

const apiUrl = 'api/type-reservations'

// Actions

export const getEntities = createAsyncThunk(
  'type-reservation/fetch_entity_list',
  async () => {
    const requestUrl = `${apiUrl}`
    return axios.get<ITypeReservation[]>(requestUrl)
  }
)

export const getEntity = createAsyncThunk(
  'type-reservation/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`
    return axios.get<ITypeReservation>(requestUrl)
  },
  { serializeError: serializeAxiosError }
)

export const createEntity = createAsyncThunk(
  'type-reservation/create_entity',
  async (entity: ITypeReservation, thunkAPI) => {
    const result = await axios.post<ITypeReservation>(apiUrl, cleanEntity(entity))
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const updateEntity = createAsyncThunk(
  'type-reservation/update_entity',
  async (entity: ITypeReservation, thunkAPI) => {
    const result = await axios.put<ITypeReservation>(`${apiUrl}/${entity.id}`, cleanEntity(entity))
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const partialUpdateEntity = createAsyncThunk(
  'type-reservation/partial_update_entity',
  async (entity: ITypeReservation, thunkAPI) => {
    const result = await axios.patch<ITypeReservation>(
      `${apiUrl}/${entity.id}`,
      cleanEntity(entity)
    )
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const deleteEntity = createAsyncThunk(
  'type-reservation/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`
    const result = await axios.delete<ITypeReservation>(requestUrl)
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

// slice

export const TypeReservationSlice = createEntitySlice({
  name: 'type-reservation',
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

export const { reset } = TypeReservationSlice.actions

// Reducer
// eslint-disable-next-line import/no-default-export
export default TypeReservationSlice.reducer
