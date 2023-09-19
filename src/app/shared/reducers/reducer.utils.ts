/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as S from '@effect/schema/Schema'
import type {
  ActionReducerMapBuilder,
  AsyncThunk,
  SerializedError,
  SliceCaseReducers,
  ValidateSliceCaseReducers
} from '@reduxjs/toolkit'
import {
  createSlice
} from '@reduxjs/toolkit'
import { AxiosError as AxiosErrorSchema } from 'app/entities/bookingbeds/AxiosError'
import type { AxiosError } from 'axios'
import { Option as O, pipe } from 'effect'
import type {} from 'immer/dist/internal'

/**
 * Model for redux actions with pagination
 */
export type IQueryParams = { query?: string; page?: number; size?: number; sort?: string }

/**
 * Useful types for working with actions
 */
type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>
export type PendingAction = ReturnType<GenericAsyncThunk['pending']>
export type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
export type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>
/**
 * Check if the async action type is rejected
 */
export function isRejectedAction(action: RejectedAction) {
  return action.type.endsWith('/rejected')
}

/**
 * Check if the async action type is pending
 */
export function isPendingAction(action: PendingAction) {
  return action.type.endsWith('/pending')
}

/**
 * Check if the async action type is completed
 */
export function isFulfilledAction(action: FulfilledAction) {
  return action.type.endsWith('/fulfilled')
}

export const Error = S.struct({ name: S.string, message: S.string })
/**
 * serialize function used for async action errors,
 * since the default function from Redux Toolkit strips useful info from axios errors
 */
export const serializeAxiosError = (value: unknown): AxiosError | SerializedError =>
  pipe(
    value,
    S.parseSync(Error),
    d => {
      const message = S.parseOption(AxiosErrorSchema)(d.message)

      return {
        message: O.isSome(message) ? message.value.response.data.raison : 'Erreur',
        code: O.isSome(message) ?
          message.value.response.status.toString() :
          d.message.includes('401') ?
          '401' :
          '500',
        isAxiosError: true,
        toJSON: '',
        name: O.isSome(message) ? message.value.name : 'Erreur'
      }
    }
  )

export interface EntityState<T,> {
  loading: boolean
  errorMessage: string | null
  entities: readonly T[]
  entity: O.Option<T>
  links?: any
  updating: boolean
  totalItems?: number
  updateSuccess: boolean
  // FIXME: remove this
  stepOne?: boolean
  creating?: boolean
}

/**
 * A wrapper on top of createSlice from Redux Toolkit to extract
 * common reducers and matchers used by entities
 */
export const createEntitySlice = <T, Reducers extends SliceCaseReducers<EntityState<T>>,>({
  name = '',
  initialState,
  reducers,
  extraReducers,
  skipRejectionHandling
}: {
  name: string
  initialState: EntityState<T>
  reducers?: ValidateSliceCaseReducers<EntityState<T>, Reducers>
  extraReducers?: (builder: ActionReducerMapBuilder<EntityState<T>>) => void
  skipRejectionHandling?: boolean
}) =>
  createSlice({
    name,
    initialState,
    reducers: {
      /**
       * Reset the entity state to initial state
       */
      reset() {
        return initialState
      },
      ...reducers
    },
    extraReducers(builder) {
      extraReducers !== undefined ? extraReducers(builder) : null
      /*
       * Common rejection logic is handled here.
       * If you want to add your own rejcetion logic, pass `skipRejectionHandling: true`
       * while calling `createEntitySlice`
       */
      if (!skipRejectionHandling) {
        builder.addMatcher(isRejectedAction, (state, action) => {
          state.loading = false
          state.updating = false
          state.updateSuccess = false
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          state.errorMessage = action.error.message
        })
      }
    }
  })
