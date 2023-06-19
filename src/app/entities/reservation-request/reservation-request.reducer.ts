import * as O from '@effect/data/Option'
import * as S from '@effect/schema/Schema'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit'
import { ReservationRequest } from 'app/shared/model/reservation-request.model'
import type { EntityState } from 'app/shared/reducers/reducer.utils'
import { createEntitySlice, serializeAxiosError } from 'app/shared/reducers/reducer.utils'
import { getHttpEntity, postHttpEntity, putHttpEntity } from 'app/shared/util/httpUtils'
import axios from 'axios'
import { castDraft } from 'immer'

const initialState: EntityState<ReservationRequest> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: O.none(),
  updating: false,
  updateSuccess: false
}

const apiUrl = 'api/reservationrequest'

// Actions

export const getReservationRequest = createAsyncThunk(
  'reservationRequest/fetch_entity',
  async (uuid: string | number) => {
    const requestUrl = `${apiUrl}/${uuid}`
    return getHttpEntity(requestUrl, ReservationRequest)
  },
  { serializeError: serializeAxiosError }
)

export const createEntity = createAsyncThunk(
  'reservationRequest/create_entity',
  async (entity: ReservationRequest) =>
    postHttpEntity(apiUrl, ReservationRequest, entity, S.string),
  { serializeError: serializeAxiosError }
)

export const updateEntity = createAsyncThunk(
  'reservationRequest/update_entity',
  async (reservationRequest: ReservationRequest) =>
    putHttpEntity(
      `${apiUrl}/${O.getOrNull(reservationRequest.reservation.reservationNumber)}`,
      ReservationRequest,
      reservationRequest,
      ReservationRequest
    ),
  { serializeError: serializeAxiosError }
)

export const deleteEntity = createAsyncThunk(
  'reservationRequest/delete_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`

    return axios.delete<ReservationRequest>(requestUrl)
  },
  { serializeError: serializeAxiosError }
)

// slice

export const ReservationRequestSlice = createEntitySlice({
  name: 'reservationRequest',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<ReservationRequest>) {
      state.entity = castDraft(O.some(action.payload))
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getReservationRequest.fulfilled, (state, action) => {
        state.loading = false
        state.entity = action.payload
      })
      .addCase(deleteEntity.fulfilled, state => {
        state.updating = false
        state.updateSuccess = true
        state.entity = castDraft(O.none())
      })
      .addMatcher(isFulfilled(createEntity, updateEntity), (state, _) => {
        state.updating = false
        state.loading = false
        state.updateSuccess = true
        state.entity = castDraft(O.none())
      })
      .addMatcher(isPending(getReservationRequest), state => {
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
// @ts-expect-error TODO: fix this
export const { reset, setData } = ReservationRequestSlice.actions

// Reducer
// eslint-disable-next-line import/no-default-export
export default ReservationRequestSlice.reducer
