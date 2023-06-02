/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit'
import type { IUser } from 'app/shared/model/user.model'
import { defaultValue } from 'app/shared/model/user.model'
import type { IQueryParams } from 'app/shared/reducers/reducer.utils'
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils'
import axios from 'axios'

const initialState = {
  loading: false,
  errorMessage: null,
  users: [] as readonly IUser[],
  authorities: [] as string[],
  user: defaultValue,
  updating: false,
  updateSuccess: false,
  totalItems: 0
}

const apiUrl = 'api/users'
const adminUrl = 'api/admin/users'

// Async Actions

export const getUsers = createAsyncThunk(
  'userManagement/fetch_users',
  async ({ page, size, sort }: IQueryParams) => {
    const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`
    return axios.get<IUser[]>(requestUrl)
  }
)

export const getUsersAsAdmin = createAsyncThunk(
  'userManagement/fetch_users_as_admin',
  async () => axios.get<IUser[]>(adminUrl)
)

export const getRoles = createAsyncThunk(
  'userManagement/fetch_roles',
  async () => axios.get<any[]>(`api/authorities`)
)

export const getUser = createAsyncThunk(
  'userManagement/fetch_user',
  async (id: string) => {
    const requestUrl = `${adminUrl}/${id}`
    return axios.get<IUser>(requestUrl)
  },
  { serializeError: serializeAxiosError }
)

export const createUser = createAsyncThunk(
  'userManagement/create_user',
  async (user: IUser, thunkAPI) => {
    // user.password = 'password'
    // user.activated = true
    user.langKey = 'fr'
    const result = await axios.post<IUser>(adminUrl, user)
    thunkAPI.dispatch(getUsersAsAdmin())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const updateUser = createAsyncThunk(
  'userManagement/update_user',
  async (user: IUser, thunkAPI) => {
    const result = await axios.put<IUser>(adminUrl, user)
    thunkAPI.dispatch(getUsersAsAdmin())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const deleteUser = createAsyncThunk(
  'userManagement/delete_user',
  async (id: string, thunkAPI) => {
    const requestUrl = `${adminUrl}/${id}`
    const result = await axios.delete<IUser>(requestUrl)
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        state.authorities = action.payload.data
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
          // @ts-expect-error TODO: fix this
          state.errorMessage = action.error.message
        }
      )
  }
})

export const { reset } = UserManagementSlice.actions

// Reducer
// eslint-disable-next-line import/no-default-export
export default UserManagementSlice.reducer
