import * as O from '@effect/data/Option'
import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit'
import { UserCategory } from 'app/shared/model/userCategory.model'
import type {
  EntityState
} from 'app/shared/reducers/reducer.utils'
import {
  createEntitySlice,
  serializeAxiosError
} from 'app/shared/reducers/reducer.utils'
import { getHttpEntity, postHttpEntity, putHttpEntity } from 'app/shared/util/httpUtils'
import axios from 'axios'
import { castDraft } from 'immer'

const initialState: EntityState<UserCategory> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: O.none(),
  updating: false,
  updateSuccess: false
}

const apiUrl = 'api/user-categories'

// Actions

export const getEntities = createAsyncThunk(
  'user-category/fetch_entity_list',
  async () => {
    const requestUrl = `${apiUrl}?cacheBuster=${new Date().getTime()}`
    return axios.get<UserCategory[]>(requestUrl)
  }
)

export const getEntity = createAsyncThunk(
  'user-category/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`

    return getHttpEntity(requestUrl, UserCategory)
  },
  { serializeError: serializeAxiosError }
)

export const createEntity = createAsyncThunk(
  'user-category/create_entity',
  async (entity: UserCategory, thunkAPI) => {
    const result = await postHttpEntity(apiUrl, UserCategory, entity, UserCategory)
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const updateEntity = createAsyncThunk(
  'user-category/update_entity',
  async (entity: UserCategory, thunkAPI) => {
    const result = await putHttpEntity(apiUrl, UserCategory, entity, UserCategory)
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const deleteEntity = createAsyncThunk(
  'user-category/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`
    const result = await axios.delete<UserCategory>(requestUrl)
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

// slice

export const UserCategorySlice = createEntitySlice({
  name: 'user-category',
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
        entities: action.payload.data
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

export const { reset } = UserCategorySlice.actions

// Reducer
// eslint-disable-next-line import/no-default-export
export default UserCategorySlice.reducer
