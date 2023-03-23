import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit'
import type { IUserCategory } from 'app/shared/model/userCategory.model'
import { defaultValue } from 'app/shared/model/userCategory.model'
import type {
  EntityState
} from 'app/shared/reducers/reducer.utils'
import {
  createEntitySlice,
  serializeAxiosError
} from 'app/shared/reducers/reducer.utils'
import { cleanEntity } from 'app/shared/util/entity-utils'
import axios from 'axios'

const initialState: EntityState<IUserCategory> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  updating: false,
  updateSuccess: false
}

const apiUrl = 'api/user-categories'

// Actions

export const getEntities = createAsyncThunk(
  'user-category/fetch_entity_list',
  async () => {
    const requestUrl = `${apiUrl}?cacheBuster=${new Date().getTime()}`
    return axios.get<IUserCategory[]>(requestUrl)
  }
)

export const getEntity = createAsyncThunk(
  'user-category/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`
    return axios.get<IUserCategory>(requestUrl)
  },
  { serializeError: serializeAxiosError }
)

export const createEntity = createAsyncThunk(
  'user-category/create_entity',
  async (entity: IUserCategory, thunkAPI) => {
    const result = await axios.post<IUserCategory>(apiUrl, cleanEntity(entity))
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const updateEntity = createAsyncThunk(
  'user-category/update_entity',
  async (entity: IUserCategory, thunkAPI) => {
    const result = await axios.put<IUserCategory>(`${apiUrl}/${entity.id}`, cleanEntity(entity))
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const partialUpdateEntity = createAsyncThunk(
  'user-category/partial_update_entity',
  async (entity: IUserCategory, thunkAPI) => {
    const result = await axios.patch<IUserCategory>(`${apiUrl}/${entity.id}`, cleanEntity(entity))
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const deleteEntity = createAsyncThunk(
  'user-category/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`
    const result = await axios.delete<IUserCategory>(requestUrl)
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

export const { reset } = UserCategorySlice.actions

// Reducer
// eslint-disable-next-line import/no-default-export
export default UserCategorySlice.reducer
