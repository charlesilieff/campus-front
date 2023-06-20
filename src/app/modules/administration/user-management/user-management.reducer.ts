/* eslint-disable @typescript-eslint/no-explicit-any */
import * as O from '@effect/data/Option'
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit'
import type { User, UserDecoded } from 'app/shared/model/user.model'
import { Authorities } from 'app/shared/model/user.model'
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils'
import { getHttpEntities } from 'app/shared/util/httpUtils'
import axios from 'axios'
import { castDraft } from 'immer'

const initialState = {
  loading: false,
  errorMessage: undefined as string | undefined,
  users: [] as readonly UserDecoded[],
  authorities: [] as readonly Authorities[],
  user: O.none(),
  updating: false,
  updateSuccess: false,
  totalItems: 0
}

const apiUrl = 'api/users'
const adminUrl = 'api/admin/users'

// Async Actions

export const getUsers = createAsyncThunk(
  'userManagement/fetch_users',
  async () => {
    const requestUrl = `${apiUrl}`
    return axios.get<User[]>(requestUrl)
  }
)

export const getUsersAsAdmin = createAsyncThunk(
  'userManagement/fetch_users_as_admin',
  async () => axios.get<User[]>(adminUrl)
)

export const getRoles = createAsyncThunk(
  'userManagement/fetch_roles',
  async () => getHttpEntities('api/authorities', Authorities)
)

export const getUser = createAsyncThunk(
  'userManagement/fetch_user',
  async (id: string) => {
    const requestUrl = `${adminUrl}/${id}`
    return axios.get<User>(requestUrl)
  },
  { serializeError: serializeAxiosError }
)

export const createUser = createAsyncThunk(
  'userManagement/create_user',
  async (user: User, thunkAPI) => {
    const result = await axios.post<User>(adminUrl, { ...user, langKey: 'fr' })
    thunkAPI.dispatch(getUsersAsAdmin())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const updateUser = createAsyncThunk(
  'userManagement/update_user',
  async (user: User, thunkAPI) => {
    const result = await axios.put<User>(adminUrl, user)
    thunkAPI.dispatch(getUsersAsAdmin())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const deleteUser = createAsyncThunk(
  'userManagement/delete_user',
  async (id: string, thunkAPI) => {
    const requestUrl = `${adminUrl}/delete/${id}`
    const result = await axios.delete<User>(requestUrl)
    thunkAPI.dispatch(getUsersAsAdmin())
    return result
  },
  { serializeError: serializeAxiosError }
)

export type UserManagementState = Readonly<typeof initialState>

export const UserManagementSlice = createSlice({
  name: 'userManagement',
  initialState: initialState as UserManagementState,
  reducers: {
    reset() {
      return initialState
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getRoles.fulfilled, (state, action) => {
        state.authorities = castDraft(action.payload)
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.data
      })
      .addCase(deleteUser.fulfilled, state => {
        state.updating = false
        state.updateSuccess = true
        state.user = defaultValue
      })
      .addMatcher(isFulfilled(getUsers, getUsersAsAdmin), (state, action) => {
        state.loading = false
        state.users = action.payload.data
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        state.totalItems = parseInt(action.payload.headers['x-total-count'], 10)
      })
      .addMatcher(isFulfilled(createUser, updateUser), (state, action) => {
        state.updating = false
        state.loading = false
        state.updateSuccess = true
        state.user = action.payload.data
      })
      .addMatcher(isPending(getUsers, getUsersAsAdmin, getUser), state => {
        state.errorMessage = null
        state.updateSuccess = false
        state.loading = true
      })
      .addMatcher(isPending(createUser, updateUser, deleteUser), state => {
        state.errorMessage = null
        state.updateSuccess = false
        state.updating = true
      })
      .addMatcher(
        isRejected(
          getUsers,
          getUsersAsAdmin,
          getUser,
          getRoles,
          createUser,
          updateUser,
          deleteUser
        ),
        (state, action) => {
          state.loading = false
          state.updating = false
          state.updateSuccess = false

          state.errorMessage = action.error.message ?
            'An error has occurred!' :
            action.error.message
        }
      )
  }
})

export const { reset } = UserManagementSlice.actions

// Reducer
// eslint-disable-next-line import/no-default-export
export default UserManagementSlice.reducer
