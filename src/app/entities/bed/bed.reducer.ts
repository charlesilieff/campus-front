import * as O from '@effect/data/Option'
import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit'
import type { BedDecoded } from 'app/shared/model/bed.model'
import { Bed, BedCreate, bedDefaultValue } from 'app/shared/model/bed.model'
import type {
  EntityState
} from 'app/shared/reducers/reducer.utils'
import {
  createEntitySlice,
  serializeAxiosError
} from 'app/shared/reducers/reducer.utils'
import { getHttpEntities, getHttpEntity, postHttpEntity,
  putHttpEntity } from 'app/shared/util/httpUtils'
import axios from 'axios'
import { castDraft } from 'immer'

const initialState: EntityState<BedDecoded> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: bedDefaultValue,
  updating: false,
  updateSuccess: false
}

const apiUrl = 'api/beds'

// Actions

export const getEntities = createAsyncThunk(
  'bed/fetch_entity_list',
  async () => {
    const requestUrl = `${apiUrl}?cacheBuster=${new Date().getTime()}`
    return getHttpEntities(requestUrl, Bed)
  }
)

export const getEntity = createAsyncThunk(
  'bed/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`

    return await getHttpEntity(requestUrl, Bed)
  },
  { serializeError: serializeAxiosError }
)

export const createEntity = createAsyncThunk(
  'bed/create_entity',
  async (entity: BedCreate, thunkAPI) => {
    const result = await postHttpEntity(apiUrl, BedCreate, entity, Bed)
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const updateEntity = createAsyncThunk(
  'bed/update_entity',
  async (entity: BedCreate, thunkAPI) => {
    const result = await putHttpEntity(
      `${apiUrl}/${O.getOrNull(entity.id)}`,
      BedCreate,
      entity,
      Bed
    )
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const deleteEntity = createAsyncThunk(
  'bed/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`
    const result = await axios.delete<Bed>(requestUrl)
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
        state.entity = action.payload
      })
      .addCase(deleteEntity.fulfilled, state => {
        state.updating = false
        state.updateSuccess = true
        state.entity = castDraft(O.none())
      })
      .addMatcher(isFulfilled(getEntities), (state, action) => ({
        ...state,
        loading: false,
        entities: action.payload
      }))
      .addMatcher(isFulfilled(createEntity, updateEntity), (state, action) => {
        state.updating = false
        state.loading = false
        state.updateSuccess = true
        state.entity = action.payload
      })
      .addMatcher(isPending(getEntities, getEntity), state => {
        state.errorMessage = null
        state.updateSuccess = false
        state.loading = true
      })
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

export const { reset } = BedSlice.actions

// Reducer
// eslint-disable-next-line import/no-default-export
export default BedSlice.reducer
