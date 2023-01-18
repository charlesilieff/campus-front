import { createAsyncThunk, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit'
import axios from 'axios'

import { defaultValue, IRoom } from 'app/shared/model/room.model'
import { createEntitySlice, EntityState, IQueryParams,
  serializeAxiosError } from 'app/shared/reducers/reducer.utils'
import { cleanEntity } from 'app/shared/util/entity-utils'

const initialState: EntityState<IRoom> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  updating: false,
  updateSuccess: false
}

const apiUrl = 'api/rooms'

// Actions

export const getEntities = createAsyncThunk(
  'room/fetch_entity_list',
  async ({ page, size, sort }: IQueryParams) => {
    const requestUrl = `${apiUrl}?cacheBuster=${new Date().getTime()}`
    return axios.get<IRoom[]>(requestUrl)
  }
)

export const getEntity = createAsyncThunk(
  'room/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`
    return axios.get<IRoom>(requestUrl)
  },
  { serializeError: serializeAxiosError }
)

export const createEntity = createAsyncThunk(
  'room/create_entity',
  async (entity: IRoom, thunkAPI) => {
    const result = await axios.post<IRoom>(apiUrl, cleanEntity(entity))
    thunkAPI.dispatch(getEntities({}))
    return result
  },
  { serializeError: serializeAxiosError }
)

export const updateEntity = createAsyncThunk(
  'room/update_entity',
  async (entity: IRoom, thunkAPI) => {
    const result = await axios.put<IRoom>(`${apiUrl}/${entity.id}`, cleanEntity(entity))
    thunkAPI.dispatch(getEntities({}))
    return result
  },
  { serializeError: serializeAxiosError }
)

export const partialUpdateEntity = createAsyncThunk(
  'room/partial_update_entity',
  async (entity: IRoom, thunkAPI) => {
    const result = await axios.patch<IRoom>(`${apiUrl}/${entity.id}`, cleanEntity(entity))
    thunkAPI.dispatch(getEntities({}))
    return result
  },
  { serializeError: serializeAxiosError }
)

export const deleteEntity = createAsyncThunk(
  'room/delete_entity',
  async (id: string | number, thunkAPI) => {
    try {
      const requestUrl = `${apiUrl}/${id}`
      const result = await axios.delete<IRoom>(requestUrl)
      thunkAPI.dispatch(getEntities({}))
      return result
    } catch (error) {
      return thunkAPI.rejectWithValue('Veuillez supprimer les lits de la chambre avant')
    }
  },
  { serializeError: serializeAxiosError }
)

// slice

export const RoomSlice = createEntitySlice({
  name: 'room',
  initialState,
  skipRejectionHandling: true,
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
      .addMatcher(isFulfilled(getEntities), (state, action) => {
        return {
          ...state,
          loading: false,
          entities: action.payload.data
        }
      })
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
      .addMatcher(isRejected(deleteEntity), state => {
        state.errorMessage =
          'Veuillez enlever/supprimer les lits de la chambre avant de vouloir supprimer la chambre.'
        state.updateSuccess = false
        state.loading = false
        state.updating = false
      })
  }
})

export const { reset } = RoomSlice.actions

// Reducer
export default RoomSlice.reducer
