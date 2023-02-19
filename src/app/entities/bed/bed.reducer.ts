import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit'
import type { IBed } from 'app/shared/model/bed.model'
import { defaultValue } from 'app/shared/model/bed.model'
import type {
  EntityState
} from 'app/shared/reducers/reducer.utils'
import {
  createEntitySlice,
  serializeAxiosError
} from 'app/shared/reducers/reducer.utils'
import { cleanEntity } from 'app/shared/util/entity-utils'
import axios from 'axios'

const initialState: EntityState<IBed> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  updating: false,
  updateSuccess: false
}

const apiUrl = 'api/beds'

// Actions

export const getEntities = createAsyncThunk(
  'bed/fetch_entity_list',
  async () => {
    const requestUrl = `${apiUrl}?cacheBuster=${new Date().getTime()}`
    return axios.get<IBed[]>(requestUrl)
  }
)

export const getEntity = createAsyncThunk(
  'bed/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`

    return axios.get<IBed>(requestUrl)
  },
  { serializeError: serializeAxiosError }
)

export const createEntity = createAsyncThunk(
  'bed/create_entity',
  async (entity: IBed, thunkAPI) => {
    const result = await axios.post<IBed>(apiUrl, cleanEntity(entity))
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const updateEntity = createAsyncThunk(
  'bed/update_entity',
  async (entity: IBed, thunkAPI) => {
    const result = await axios.put<IBed>(`${apiUrl}/${entity.id}`, cleanEntity({ ...entity }))
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const partialUpdateEntity = createAsyncThunk(
  'bed/partial_update_entity',
  async (entity: IBed, thunkAPI) => {
    const result = await axios.patch<IBed>(`${apiUrl}/${entity.id}`, cleanEntity(entity))
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const deleteEntity = createAsyncThunk(
  'bed/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`
    const result = await axios.delete<IBed>(requestUrl)
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

// slice

export const BedSlice = createEntitySlice({
  name: 'bed',
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

export const { reset } = BedSlice.actions

// Reducer
// eslint-disable-next-line import/no-default-export
export default BedSlice.reducer
