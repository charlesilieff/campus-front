import { createAsyncThunk, createSlice, isPending, isRejected } from '@reduxjs/toolkit'
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils'
import axios from 'axios'

const initialState = {
  loading: false,
  resetPasswordSuccess: false,
  resetPasswordFailure: false,
  successMessage: null
}

export type PasswordResetState = Readonly<typeof initialState>

const apiUrl = 'api/account/reset-password'
// Actions

export const handlePasswordResetInit = createAsyncThunk(
  'passwordReset/reset_password_init',
  // If the content-type isn't set that way, axios will try to encode the body and thus modify the data sent to the server.
  async (mail: string) =>
    axios.post(`${apiUrl}/init`, mail, { headers: { ['Content-Type']: 'text/plain' } }),
  { serializeError: serializeAxiosError }
)

export const handlePasswordResetFinish = createAsyncThunk(
  'passwordReset/reset_password_finish',
  async (data: { key: string | null; newPassword: string }) => axios.post(`${apiUrl}/finish`, data),
  { serializeError: serializeAxiosError }
)

export const PasswordResetSlice = createSlice({
  name: 'passwordReset',
  initialState: initialState as PasswordResetState,
  reducers: {
    reset() {
      return initialState
    }
  },
  extraReducers(builder) {
    // @ts-expect-error TODO: fix this
    builder
      .addCase(handlePasswordResetInit.fulfilled, () => ({
        ...initialState,
        loading: false,
        resetPasswordSuccess: true,
        successMessage: 'Consultez vos emails pour savoir comment réinitialiser votre mot de passe.'
      }))
      .addCase(handlePasswordResetFinish.fulfilled, () => ({
        ...initialState,
        loading: false,
        resetPasswordSuccess: true,
        successMessage: 'Votre mot de passe a bien été changé. Essayez de vous connectez avec.'
      }))
      .addMatcher(isPending(handlePasswordResetInit, handlePasswordResetFinish), state => {
        state.loading = true
      })
      .addMatcher(isRejected(handlePasswordResetInit, handlePasswordResetFinish), () => ({
        ...initialState,
        loading: false,
        resetPasswordFailure: true
      }))
  }
})

export const { reset } = PasswordResetSlice.actions

// Reducer
// eslint-disable-next-line import/no-default-export
export default PasswordResetSlice.reducer
