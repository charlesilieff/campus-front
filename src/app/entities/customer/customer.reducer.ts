import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit'
import type { CustomerDecoded } from 'app/shared/model/customer.model'
import { Customer } from 'app/shared/model/customer.model'
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
import { Option as O } from 'effect'
import { castDraft } from 'immer'

const initialState: EntityState<CustomerDecoded> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: O.none(),
  updating: false,
  updateSuccess: false
}

const apiUrl = 'api/customers'

// Actions

export const getEntities = createAsyncThunk(
  'customer/fetch_entity_list',
  async () => {
    const requestUrl = `${apiUrl}`
    return getHttpEntities(requestUrl, Customer)
  }
)

export const getCustomer = createAsyncThunk(
  'customer/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`
    return getHttpEntity(requestUrl, Customer)
  },
  { serializeError: serializeAxiosError }
)

export const createEntity = createAsyncThunk(
  'customer/create_entity',
  async (entity: CustomerDecoded, thunkAPI) => {
    const result = postHttpEntity(apiUrl, Customer, entity, Customer)
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const updateEntity = createAsyncThunk(
  'customer/update_entity',
  async (entity: CustomerDecoded, thunkAPI) => {
    const result = putHttpEntity(`${apiUrl}/${O.getOrNull(entity.id)}`, Customer, entity, Customer)
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const deleteEntity = createAsyncThunk(
  'customer/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`
    const result = await axios.delete<CustomerDecoded>(requestUrl)
    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

// slice

export const CustomerSlice = createEntitySlice({
  name: 'customer',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(getCustomer.fulfilled, (state, action) => {
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
      .addMatcher(isPending(getEntities, getCustomer), state => {
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

export const { reset } = CustomerSlice.actions

// Reducer
// eslint-disable-next-line import/no-default-export
export default CustomerSlice.reducer
