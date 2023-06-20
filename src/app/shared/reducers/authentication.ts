import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import * as T from '@effect/io/Effect'
import * as S from '@effect/schema/Schema'
import { formatErrors } from '@effect/schema/TreeFormatter'
import type { Dispatch } from '@reduxjs/toolkit'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { AppThunk } from 'app/config/store'
import type { AxiosResponse } from 'axios'
import axios from 'axios'

import { User } from '../model/user.model'
import { getHttpEntity } from '../util/httpUtils'
import { Storage } from '../util/storage-util'
import { serializeAxiosError } from './reducer.utils'

const AUTH_TOKEN_KEY = 'jhi-authenticationToken'

export const initialState = {
  loading: false,
  isAuthenticated: false,
  loginSuccess: false,
  loginError: false, // Errors returned from server side
  showModalLogin: false,
  account: O.none<User>(),
  errorMessage: O.none<string>(), // Errors returned from server side
  redirectMessage: O.none<string>(),
  sessionHasBeenFetched: false,
  idToken: O.none<string>(),
  logoutUrl: O.none<string>()
}

export type AuthenticationState = Readonly<typeof initialState>

// Actions

export const getSession = (): AppThunk => dispatch => {
  dispatch(getAccount())
}

export const getAccount = createAsyncThunk(
  'authentication/get_account',
  async () => getHttpEntity('api/account', User),
  {
    serializeError: serializeAxiosError
  }
)

const AuthParams = S.struct({
  username: S.string,
  password: S.string,
  rememberMe: S.optional(S.boolean).toOption()
})
type AuthParams = S.To<typeof AuthParams>

const IdToken = S.struct({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  id_token: S.string
})
type IdToken = S.To<typeof IdToken>

export const authenticate = createAsyncThunk(
  'authentication/login',
  async (auth: AuthParams) =>
    pipe(
      S.encodeEffect(AuthParams)(auth),
      T.mapError(e => formatErrors(e.errors)),
      T.flatMap(b => T.promise(() => axios.post('api/authenticate', b))),
      T.runPromise
    ),
  {
    serializeError: serializeAxiosError
  }
)

export const login: (
  username: string,
  password: string,
  rememberMe: O.Option<boolean>
) => AppThunk = (
  username,
  password,
  rememberMe = O.some(false)
) =>
async dispatch => {
  const result = await dispatch(authenticate({ username, password, rememberMe }))

  const response = result.payload as AxiosResponse<IdToken>
  console.log('response', result)
  if (response) {
    if (rememberMe) {
      Storage.local.set(AUTH_TOKEN_KEY, response.data.id_token)
    } else {
      Storage.local.set(AUTH_TOKEN_KEY, response.data.id_token)
    }
  }
  dispatch(getSession())
}

export const clearAuthToken = () => {
  if (Storage.local.get(AUTH_TOKEN_KEY)) {
    Storage.local.remove(AUTH_TOKEN_KEY)
  }
  if (Storage.session.get(AUTH_TOKEN_KEY)) {
    Storage.session.remove(AUTH_TOKEN_KEY)
  }
}

export const logout: () => AppThunk = () => dispatch => {
  clearAuthToken()
  dispatch(logoutSession())
}

export const clearAuthentication = messageKey => (dispatch: Dispatch) => {
  clearAuthToken()
  dispatch(authError(messageKey))
  dispatch(clearAuth())
}

export const AuthenticationSlice = createSlice({
  name: 'authentication',
  initialState: initialState as AuthenticationState,
  reducers: {
    logoutSession() {
      return {
        ...initialState,
        showModalLogin: true
      }
    },
    authError(state, action) {
      return {
        ...state,
        showModalLogin: true,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        redirectMessage: action.payload
      }
    },
    clearAuth(state) {
      return {
        ...state,
        loading: false,
        showModalLogin: true,
        isAuthenticated: false
      }
    }
  },
  extraReducers(builder) {
    builder
      .addCase(authenticate.rejected, (_state, action) => ({
        ...initialState,
        errorMessage: O.fromNullable(action.error.message),
        showModalLogin: true,
        loginError: true
      }))
      .addCase(authenticate.fulfilled, state => ({
        ...state,
        loading: false,
        loginError: false,
        showModalLogin: false,
        loginSuccess: true
      }))
      .addCase(getAccount.rejected, (state, action) => ({
        ...state,
        loading: false,
        isAuthenticated: false,
        sessionHasBeenFetched: true,
        showModalLogin: true,
        errorMessage: O.fromNullable(action.error.message)
      }))
      .addCase(getAccount.fulfilled, (state, action) => {
        const isAuthenticated = pipe(
          action.payload,
          O.map(a => a.activated),
          O.getOrElse(() => false)
        )

        return {
          ...state,
          isAuthenticated,
          loading: false,
          sessionHasBeenFetched: true,
          account: action.payload
        }
      })
      .addCase(authenticate.pending, state => {
        state.loading = true
      })
      .addCase(getAccount.pending, state => {
        state.loading = true
      })
  }
})

export const { logoutSession, authError, clearAuth } = AuthenticationSlice.actions

// Reducer
// eslint-disable-next-line import/no-default-export
export default AuthenticationSlice.reducer
