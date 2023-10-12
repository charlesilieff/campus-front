import { createAsyncThunk, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit'
import type { RoomCreateDecoded } from 'app/shared/model/room.model'
import { Room, RoomCreate } from 'app/shared/model/room.model'
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

const initialState: EntityState<Room> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: O.none(),
  updating: false,
  updateSuccess: false
}

const apiUrl = 'api/rooms'

// Actions

export const getEntities = createAsyncThunk(
  'room/fetch_entity_list',
  async () => {
    const requestUrl = `${apiUrl}`
    return getHttpEntities(requestUrl, Room)
  }
)

export const getEntity = createAsyncThunk(
  'room/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`
    return getHttpEntity(requestUrl, Room)
  },
  { serializeError: serializeAxiosError }
)

export const createEntity = createAsyncThunk(
  'room/create_entity',
  async (entity: RoomCreateDecoded, thunkAPI) => {
    const result = await postHttpEntity(apiUrl, RoomCreate, entity, Room)

    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const updateEntity = createAsyncThunk(
  'room/update_entity',
  async (entity: RoomCreateDecoded, thunkAPI) => {
    const result = await putHttpEntity(
      `${apiUrl}/${O.getOrNull(entity.id)}`,
      RoomCreate,
      entity,
      Room
    )

    thunkAPI.dispatch(getEntities())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const deleteEntity = createAsyncThunk(
  'room/delete_entity',
  async (id: string | number, thunkAPI) => {
    try {
      const requestUrl = `${apiUrl}/${id}`
      const result = await axios.delete<Room>(requestUrl)
      thunkAPI.dispatch(getEntities())
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
// eslint-disable-next-line import/no-default-export
export default RoomSlice.reducer
