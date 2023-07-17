import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit'
import { defaultValue, Place } from 'app/shared/model/place.model'
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

const initialState: EntityState<Place> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  updating: false,
  updateSuccess: false
}

const apiUrl = 'api/places'

// Actions

export const findAllPlaces = createAsyncThunk(
  'place/fetch_entity_list',
  async () => {
    const requestUrl = `${apiUrl}`
    return await getHttpEntities(requestUrl, Place)
  }
)

export const findOnePlaceById = createAsyncThunk(
  'place/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`
    return await getHttpEntity(requestUrl, Place)
  },
  { serializeError: serializeAxiosError }
)

export const savePlace = createAsyncThunk(
  'place/create_entity',
  async (entity: Place, thunkAPI) => {
    const result = await postHttpEntity(`${apiUrl}/${entity.id}`, Place, entity, Place)
    thunkAPI.dispatch(findAllPlaces())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const updateEntity = createAsyncThunk(
  'place/update_entity',
  async (entity: Place, thunkAPI) => {
    const result = await putHttpEntity(`${apiUrl}/${entity.id}`, Place, entity, Place)

    thunkAPI.dispatch(findAllPlaces())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const deleteEntity = createAsyncThunk(
  'place/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`
    const result = await axios.delete<Place>(requestUrl)
    thunkAPI.dispatch(findAllPlaces())
    return result
  },
  { serializeError: serializeAxiosError }
)

// slice

export const PlaceSlice = createEntitySlice({
  name: 'place',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(findOnePlaceById.fulfilled, (state, action) => {
        state.loading = false
        state.entity = action.payload
      })
      .addCase(deleteEntity.fulfilled, state => {
        state.updating = false
        state.updateSuccess = true
        state.entity = castDraft(O.none())
      })
      .addMatcher(isFulfilled(findAllPlaces), (state, action) => ({
        ...state,
        loading: false,
        entities: action.payload
      }))
      .addMatcher(isFulfilled(savePlace, updateEntity), (state, action) => {
        state.updating = false
        state.loading = false
        state.updateSuccess = true
        state.entity = action.payload
      })
      .addMatcher(isPending(findAllPlaces, findOnePlaceById), state => {
        state.errorMessage = null
        state.updateSuccess = false
        state.loading = true
      })
      .addMatcher(
        isPending(savePlace, updateEntity, deleteEntity),
        state => {
          state.errorMessage = null
          state.updateSuccess = false
          state.updating = true
        }
      )
  }
})

export const { reset } = PlaceSlice.actions

// Reducer
// eslint-disable-next-line import/no-default-export
export default PlaceSlice.reducer
