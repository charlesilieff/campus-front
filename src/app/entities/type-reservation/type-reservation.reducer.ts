import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit'
import { TypeReservation, TypeReservationCreate } from 'app/shared/model/typeReservation.model'
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
import { Option as O } from 'effect'
import { castDraft } from 'immer'

const initialState: EntityState<TypeReservation> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: O.none(),
  updating: false,
  updateSuccess: false
}

const apiUrl = 'api/type-reservations'

// Actions

export const getEntities = createAsyncThunk(
  'type-reservation/fetch_entity_list',
  async () => {
    const requestUrl = `${apiUrl}`

    return getHttpEntities(requestUrl, TypeReservation)
  }
)

export const getEntity = createAsyncThunk(
  'type-reservation/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`

    return getHttpEntity(requestUrl, TypeReservation)
  },
  { serializeError: serializeAxiosError }
)

export const createEntity = createAsyncThunk(
  'type-reservation/create_entity',
  async (entity: TypeReservationCreate, thunkAPI) => {
    const result = await postHttpEntity(apiUrl, TypeReservationCreate, entity, TypeReservation)
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const updateEntity = createAsyncThunk(
  'type-reservation/update_entity',
  async (entity: TypeReservationCreate, thunkAPI) => {
    const result = await putHttpEntity(apiUrl, TypeReservationCreate, entity, TypeReservation)
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const deleteEntity = createAsyncThunk(
  'type-reservation/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`
    const result = await axios.delete<TypeReservation>(requestUrl)
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

export const { reset } = TypeReservationSlice.actions

// Reducer
// eslint-disable-next-line import/no-default-export
export default TypeReservationSlice.reducer
