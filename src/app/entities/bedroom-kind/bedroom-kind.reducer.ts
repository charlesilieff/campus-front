import * as O from '@effect/data/Option'
import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit'
import { BedroomKind, BedroomKindCreate } from 'app/shared/model/bedroom-kind.model'
import type {
  EntityState
} from 'app/shared/reducers/reducer.utils'
import {
  createEntitySlice,
  serializeAxiosError
} from 'app/shared/reducers/reducer.utils'
import {
  getHttpEntities,
  getHttpEntity,
  postHttpEntity,
  putHttpEntity
} from 'app/shared/util/httpUtils'
import axios from 'axios'

const initialState: EntityState<BedroomKind> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: O.none(),
  updating: false,
  updateSuccess: false
}

const apiUrl = 'api/bedroom-kinds'

// Actions

export const getEntities = createAsyncThunk(
  'bedroomKind/fetch_entity_list',
  async () => {
    const requestUrl = `${apiUrl}`
    return getHttpEntities(requestUrl, BedroomKind)
  }
)

export const getEntity = createAsyncThunk(
  'bedroomKind/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`
    return await getHttpEntity(requestUrl, BedroomKind)
  },
  { serializeError: serializeAxiosError }
)

export const createEntity = createAsyncThunk(
  'bedroomKind/create_entity',
  async (entity: BedroomKindCreate, thunkAPI) => {
    const result = postHttpEntity(
      apiUrl,
      BedroomKindCreate,
      entity,
      BedroomKind
    )

    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const updateEntity = createAsyncThunk(
  'bedroomKind/update_entity',
  async (entity: BedroomKind, thunkAPI) => {
    const result = putHttpEntity(
      `${apiUrl}/${entity.id}`,
      BedroomKind,
      entity,
      BedroomKind
    )
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const deleteEntity = createAsyncThunk(
  'bedroomKind/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`
    const result = await axios.delete<BedroomKind>(requestUrl)
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

// slice

export const BedroomKindSlice = createEntitySlice({
  name: 'bedroomKind',
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
        state.entity = O.none()
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

export const { reset } = BedroomKindSlice.actions

// Reducer
// eslint-disable-next-line import/no-default-export
export default BedroomKindSlice.reducer
