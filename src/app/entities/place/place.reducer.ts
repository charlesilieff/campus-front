import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit'
import type { IPlace } from 'app/shared/model/place.model'
import { defaultValue } from 'app/shared/model/place.model'
import type {
  EntityState
} from 'app/shared/reducers/reducer.utils'
import {
  createEntitySlice,
  serializeAxiosError
} from 'app/shared/reducers/reducer.utils'
import { cleanEntity } from 'app/shared/util/entity-utils'
import axios from 'axios'

const initialState: EntityState<IPlace> = {
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
    return axios.get<IPlace[]>(requestUrl)
  }
)

export const findOnePlaceById = createAsyncThunk(
  'place/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`
    return axios.get<IPlace>(requestUrl)
  },
  { serializeError: serializeAxiosError }
)

export const savePlace = createAsyncThunk(
  'place/create_entity',
  async (entity: IPlace, thunkAPI) => {
    const result = await axios.post<IPlace>(apiUrl, cleanEntity(entity))
    thunkAPI.dispatch(findAllPlaces())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const updateEntity = createAsyncThunk(
  'place/update_entity',
  async (entity: IPlace, thunkAPI) => {
    const result = await axios.put<IPlace>(`${apiUrl}/${entity.id}`, cleanEntity(entity))
    thunkAPI.dispatch(findAllPlaces())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const partialUpdateEntity = createAsyncThunk(
  'place/partial_update_entity',
  async (entity: IPlace, thunkAPI) => {
    const result = await axios.patch<IPlace>(`${apiUrl}/${entity.id}`, cleanEntity(entity))
    thunkAPI.dispatch(findAllPlaces())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const deleteEntity = createAsyncThunk(
  'place/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`
    const result = await axios.delete<IPlace>(requestUrl)
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
        state.entity = action.payload.data
      })
      .addCase(deleteEntity.fulfilled, state => {
        state.updating = false
        state.updateSuccess = true
        state.entity = {}
      })
      .addMatcher(isFulfilled(findAllPlaces), (state, action) => ({
        ...state,
        loading: false,
        entities: action.payload.data
      }))
      .addMatcher(isFulfilled(savePlace, updateEntity, partialUpdateEntity), (state, action) => {
        state.updating = false
        state.loading = false
        state.updateSuccess = true
        state.entity = action.payload.data
      })
      .addMatcher(isPending(findAllPlaces, findOnePlaceById), state => {
        state.errorMessage = null
        state.updateSuccess = false
        state.loading = true
      })
      .addMatcher(
        isPending(savePlace, updateEntity, partialUpdateEntity, deleteEntity),
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
