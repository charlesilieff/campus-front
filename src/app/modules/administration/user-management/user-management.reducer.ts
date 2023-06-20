/* eslint-disable @typescript-eslint/no-explicit-any */
import * as O from '@effect/data/Option'
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit'
import { Authorities, User } from 'app/shared/model/user.model'
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils'
import { getHttpEntities, getHttpEntity, postHttpEntity,
  putHttpEntity } from 'app/shared/util/httpUtils'
import axios from 'axios'
import { castDraft } from 'immer'

const initialState = {
  loading: false,
  errorMessage: undefined as string | undefined,
  users: [] as User[],
  authorities: [] as readonly Authorities[],
  user: O.none<User>(),
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
    const requestUrl = apiUrl

    return getHttpEntities(requestUrl, User)
  }
)

export const getUsersAsAdmin = createAsyncThunk(
  'userManagement/fetch_users_as_admin',
  async () => getHttpEntities(adminUrl, User)
)

export const getRoles = createAsyncThunk(
  'userManagement/fetch_roles',
  async () => getHttpEntities('api/authorities', Authorities)
)

export const getUser = createAsyncThunk(
  'userManagement/fetch_user',
  async (id: string) => {
    const requestUrl = `${adminUrl}/${id}`

    return getHttpEntity(requestUrl, User)
  },
  { serializeError: serializeAxiosError }
)

export const createUser = createAsyncThunk(
  'userManagement/create_user',
  async (user: User, thunkAPI) => {
    const result = await postHttpEntity(adminUrl, User, user, User)

    thunkAPI.dispatch(getUsersAsAdmin())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const updateUser = createAsyncThunk(
  'userManagement/update_user',
  async (user: User, thunkAPI) => {
    const result = await putHttpEntity(adminUrl, User, user, User)
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
        state.authorities = action.payload
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(deleteUser.fulfilled, state => {
        state.updating = false
        state.updateSuccess = true
        state.user = castDraft(O.none())
      })
      .addMatcher(isFulfilled(getUsers, getUsersAsAdmin), (state, action) => {
        state.loading = false
        state.users = action.payload
        // state.totalItems = parseInt(action.payload.headers['x-total-count'], 10)
      })
      .addMatcher(isFulfilled(createUser, updateUser), (state, action) => {
        state.updating = false
        state.loading = false
        state.updateSuccess = true
        state.user = action.payload
      })
      .addMatcher(isPending(getUsers, getUsersAsAdmin, getUser), state => {
        state.errorMessage = undefined
        state.updateSuccess = false
        state.loading = true
      })
      .addMatcher(isPending(createUser, updateUser, deleteUser), state => {
        state.errorMessage = undefined
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
