import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit'
import type { IReservationRequest } from 'app/shared/model/reservation-request.model'
import { defaultValue } from 'app/shared/model/reservation-request.model'
import type { EntityState } from 'app/shared/reducers/reducer.utils'
import { createEntitySlice, serializeAxiosError } from 'app/shared/reducers/reducer.utils'
import { cleanEntity } from 'app/shared/util/entity-utils'
import axios from 'axios'

const initialState: EntityState<IReservationRequest> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  updating: false,
  updateSuccess: false
}

const apiUrl = 'api/reservationrequest'

// Actions

export const getReservationRequest = createAsyncThunk(
  'reservationRequest/fetch_entity',
  async (uuid: string | number) => {
    const requestUrl = `${apiUrl}/${uuid}`
    return axios.get<IReservationRequest>(requestUrl)
  },
  { serializeError: serializeAxiosError }
)

export const createEntity = createAsyncThunk(
  'reservationRequest/create_entity',
  async (entity: IReservationRequest) => axios.post<IReservationRequest>(apiUrl, entity),
  { serializeError: serializeAxiosError }
)

export const updateEntity = createAsyncThunk(
  'reservationRequest/update_entity',
  async (entity: { ReservationRequest: IReservationRequest; UUID: string }) =>
    axios.put<IReservationRequest>(
      `${apiUrl}/${entity.UUID}`,
      cleanEntity(entity.ReservationRequest)
    ),
  { serializeError: serializeAxiosError }
)

export const partialUpdateEntity = createAsyncThunk(
  'reservationRequest/partial_update_entity',
  async (entity: { ReservationRequest: IReservationRequest; UUID: string }) =>
    axios.patch<IReservationRequest>(
      `${apiUrl}/${entity.UUID}`,
      cleanEntity(entity.ReservationRequest),
      {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'Content-Type': 'application/merge-patch+json'
        }
      }
    ),
  { serializeError: serializeAxiosError }
)

export const deleteEntity = createAsyncThunk(
  'reservationRequest/delete_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`

    return axios.delete<IReservationRequest>(requestUrl)
  },
  { serializeError: serializeAxiosError }
)

// slice
// @ts-expect-error inferred type of 'BookingBedsSlice' cannot be named without
export const ReservationRequestSlice = createEntitySlice({
  name: 'reservationRequest',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<IReservationRequest>) {
      state.entity.customer = action.payload.customer
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getReservationRequest.fulfilled, (state, action) => {
        state.loading = false
        state.entity = action.payload.data
      })
      .addCase(deleteEntity.fulfilled, state => {
        state.updating = false
        state.updateSuccess = true
        state.entity = {}
      })
      .addMatcher(isFulfilled(createEntity, updateEntity, partialUpdateEntity), (state, action) => {
        state.updating = false
        state.loading = false
        state.updateSuccess = true
        state.entity.reservation = action.payload.data.reservation
      })
      .addMatcher(isPending(getReservationRequest), state => {
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

export const { reset, setData } = ReservationRequestSlice.actions

// Reducer
// eslint-disable-next-line import/no-default-export
export default ReservationRequestSlice.reducer
