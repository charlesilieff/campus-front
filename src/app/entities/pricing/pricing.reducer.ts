import * as O from '@effect/data/Option'
import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit'
import { Pricing, PricingCreate } from 'app/shared/model/pricing.model'
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
import { castDraft } from 'immer'

const initialState: EntityState<Pricing> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: O.none(),
  updating: false,
  updateSuccess: false
}

const apiUrl = 'api/pricings'

// Actions

export const getEntities = createAsyncThunk(
  'pricing/fetch_entity_list',
  async () => {
    const requestUrl = `${apiUrl}`

    return getHttpEntities(requestUrl, Pricing)
  }
)

export const getEntity = createAsyncThunk(
  'pricing/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`

    return getHttpEntity(requestUrl, Pricing)
  },
  { serializeError: serializeAxiosError }
)

export const createEntity = createAsyncThunk(
  'pricing/create_entity',
  async (entity: PricingCreate, thunkAPI) => {
    const result = await postHttpEntity(apiUrl, PricingCreate, entity, Pricing)
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const updateEntity = createAsyncThunk(
  'pricing/update_entity',
  async (entity: PricingCreate, thunkAPI) => {
    const result = await putHttpEntity(apiUrl, PricingCreate, entity, Pricing)
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const deleteEntity = createAsyncThunk(
  'pricing/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`
    const result = await axios.delete<Pricing>(requestUrl)
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

// slice

export const PricingSlice = createEntitySlice({
  name: 'pricing',
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

export const { reset } = PricingSlice.actions

// Reducer
// eslint-disable-next-line import/no-default-export
export default PricingSlice.reducer
