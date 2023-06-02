import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils'
import axios from 'axios'

const initialState = {
  loading: false,
  registrationSuccess: false,
  registrationFailure: false,
  // @ts-expect-error TODO: fix this
  errorMessage: null as string,
  // @ts-expect-error TODO: fix this
  successMessage: null as string
}

export type RegisterState = Readonly<typeof initialState>

// Actions

interface IRegister {
  login: string
  email: string
  password: string
  langKey?: string
}
interface IRegisterIntermittent extends IRegister {
  firstname: string
  lastname: string
  phoneNumber?: string
  age?: number
}

export const handleRegister = createAsyncThunk(
  'register/create_account',
  async (data: { login: string; email: string; password: string; langKey?: string }) =>
    axios.post<IRegister>('api/register', data),
  { serializeError: serializeAxiosError }
)

export const handleIntermittentRegister = createAsyncThunk(
  'register/create_account',
  async (data: IRegisterIntermittent) =>
    axios.post<IRegisterIntermittent>('api/register/intermittent', data),
  { serializeError: serializeAxiosError }
)

export const RegisterSlice = createSlice({
  name: 'register',
  initialState: initialState as RegisterState,
  reducers: {
    reset() {
      return initialState
    }
  },
  extraReducers(builder) {
    // @ts-expect-error TODO: fix this
    builder
      .addCase(handleRegister.pending, state => {
        state.loading = true
      })
      .addCase(handleRegister.rejected, (state, action) => ({
        ...initialState,
        registrationFailure: true,
        errorMessage: action.error.message
      }))
      .addCase(handleRegister.fulfilled, () => ({
        ...initialState,
        registrationSuccess: true,
        successMessage:
          'Inscription enregistrée ! Veuillez vérifier votre e-mail pour pouvoir vous connecter.'
      }))
  }
})

export const { reset } = RegisterSlice.actions

// Reducer
// eslint-disable-next-line import/no-default-export
export default RegisterSlice.reducer
