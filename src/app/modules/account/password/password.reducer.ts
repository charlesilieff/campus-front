import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils'
import axios from 'axios'

const initialState = {
  loading: false,
  // @ts-expect-error TODO: fix this
  errorMessage: null as string,
  // @ts-expect-error TODO: fix this
  successMessage: null as string,
  updateSuccess: false,
  updateFailure: false
}

export type PasswordState = Readonly<typeof initialState>

const apiUrl = 'api/account'

interface IPassword {
  currentPassword: string
  newPassword: string
}

// Actions

export const savePassword = createAsyncThunk(
  'password/update_password',
  async (password: IPassword) => axios.post(`${apiUrl}/change-password`, password),
  { serializeError: serializeAxiosError }
)

export const PasswordSlice = createSlice({
  name: 'password',
  initialState: initialState as PasswordState,
  reducers: {
    reset() {
      return initialState
    }
  },
  extraReducers(builder) {
    builder
      .addCase(savePassword.pending, state => {
        // @ts-expect-error TODO: fix this
        state.errorMessage = null
        state.updateSuccess = false
        state.loading = true
      })
      .addCase(savePassword.rejected, state => {
        state.loading = false
        state.updateSuccess = false
        state.updateFailure = true
        state.errorMessage = "Une erreur s'est produite ! Le mot de passe n'a pas pu être modifié."
      })
      .addCase(savePassword.fulfilled, state => {
        state.loading = false
        state.updateSuccess = true
        state.updateFailure = false
        state.successMessage = 'Mot de passe modifié!'
      })
  }
})

export const { reset } = PasswordSlice.actions

// Reducer
// eslint-disable-next-line import/no-default-export
export default PasswordSlice.reducer
