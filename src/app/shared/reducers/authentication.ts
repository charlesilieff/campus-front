import type { Dispatch } from '@reduxjs/toolkit'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { AppThunk } from 'app/config/store'
import type { AxiosResponse } from 'axios'
import axios from 'axios'

import type { IUser } from '../model/user.model'
import { Storage } from '../util/storage-util'
import { serializeAxiosError } from './reducer.utils'

const AUTH_TOKEN_KEY = 'jhi-authenticationToken'

export const initialState = {
  loading: false,
  isAuthenticated: false,
  loginSuccess: false,
  loginError: false, // Errors returned from server side
  showModalLogin: false,
  account: {} as IUser,
  errorMessage: null as unknown as string, // Errors returned from server side
  redirectMessage: null as unknown as string,
  sessionHasBeenFetched: false,
  idToken: null as unknown as string,
  logoutUrl: null as unknown as string
}

export type AuthenticationState = Readonly<typeof initialState>

// Actions

export const getSession = (): AppThunk => dispatch => {
  dispatch(getAccount())
}

export const getAccount = createAsyncThunk(
  'authentication/get_account',
  async () => axios.get<IUser>('api/account'),
  {
    serializeError: serializeAxiosError
  }
)

interface IAuthParams {
  username: string
  password: string
  rememberMe?: boolean
}

export const authenticate = createAsyncThunk(
  'authentication/login',
  async (auth: IAuthParams) => axios.post<IAuthParams>('api/authenticate', auth),
  {
    serializeError: serializeAxiosError
  }
)

export const login: (username: string, password: string, rememberMe?: boolean) => AppThunk = (
  username,
  password,
  rememberMe = false
) =>
async dispatch => {
  const result = await dispatch(authenticate({ username, password, rememberMe }))

  const response = result.payload as AxiosResponse
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const bearerToken: string = response?.headers?.authorization
  if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
    const jwt = bearerToken.slice(7, bearerToken.length)
    if (rememberMe) {
      Storage.local.set(AUTH_TOKEN_KEY, jwt)
    } else {
      Storage.session.set(AUTH_TOKEN_KEY, jwt)
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
        errorMessage: action.error.message,
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
        errorMessage: action.error.message
      }))
      .addCase(getAccount.fulfilled, (state, action) => {
        const isAuthenticated = action.payload && action.payload.data
          && action.payload.data.activated
        return {
          ...state,
          isAuthenticated,
          loading: false,
          sessionHasBeenFetched: true,
          account: action.payload.data
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
