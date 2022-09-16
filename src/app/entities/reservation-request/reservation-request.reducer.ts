import { createAsyncThunk, isFulfilled, isPending, PayloadAction } from '@reduxjs/toolkit';
import { defaultValue, IReservationRequest } from 'app/shared/model/reservation-request.model';
import { createEntitySlice, EntityState, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { cleanEntity } from 'app/shared/util/entity-utils';
import axios from 'axios';

const initialState: EntityState<IReservationRequest> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
  stepOne: false,
};

const apiUrl = 'api/reservationrequest';

// Actions

export const getEntity = createAsyncThunk(
  'reservationRequest/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`;
    return axios.get<IReservationRequest>(requestUrl);
  },
  { serializeError: serializeAxiosError }
);

export const createEntity = createAsyncThunk(
  'reservationRequest/create_entity',
  async (entity: IReservationRequest) => {
    return axios.post<IReservationRequest>(apiUrl, entity);
  },
  { serializeError: serializeAxiosError }
);

export const updateEntity = createAsyncThunk(
  'reservationRequest/update_entity',
  async (entity: { ReservationRequest: IReservationRequest; UUID: string }) => {
    return axios.put<IReservationRequest>(`${apiUrl}/${entity.UUID}`, cleanEntity(entity.ReservationRequest));
  },
  { serializeError: serializeAxiosError }
);

export const partialUpdateEntity = createAsyncThunk(
  'reservationRequest/partial_update_entity',
  async (entity: { ReservationRequest: IReservationRequest; UUID: string }) => {
    return axios.patch<IReservationRequest>(`${apiUrl}/${entity.UUID}`, cleanEntity(entity.ReservationRequest), {
      headers: {
        'Content-Type': 'application/merge-patch+json',
      },
    });
  },
  { serializeError: serializeAxiosError }
);

export const deleteEntity = createAsyncThunk(
  'reservationRequest/delete_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`;

    return axios.delete<IReservationRequest>(requestUrl);
  },
  { serializeError: serializeAxiosError }
);

// slice

export const ReservationRequestSlice = createEntitySlice({
  name: 'reservationRequest',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<IReservationRequest>) {
      state.entity.customer = action.payload.customer;

      state.stepOne = true;
    },
    backToOne(state, action: PayloadAction<IReservationRequest>) {
      state.stepOne = false;

      state.entity.reservation = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getEntity.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addCase(deleteEntity.fulfilled, state => {
        state.updating = false;
        state.updateSuccess = true;
        state.entity = {};
      })
      .addMatcher(isFulfilled(createEntity, updateEntity, partialUpdateEntity), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity.reservation = action.payload.data.reservation;
      })
      .addMatcher(isPending(getEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.loading = true;
      })
      .addMatcher(isPending(createEntity, updateEntity, partialUpdateEntity, deleteEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
      });
  },
});

export const { reset, setData, backToOne } = ReservationRequestSlice.actions;

// Reducer
export default ReservationRequestSlice.reducer;
