import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

import { AppThunk } from 'app/config/store'
import { getSession } from 'app/shared/reducers/authentication'
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils'

const initialState = {
  loading: false,
  errorMessage: null,
  successMessage: null,
  updateSuccess: false,
  updateFailure: false
}

export type SettingsState = Readonly<typeof initialState>

// Actions
const apiUrl = 'api/account'

export const saveAccountSettings: (account: any) => AppThunk = account => async dispatch => {
  await dispatch(updateAccount(account))

  dispatch(getSession())
}

export const updateAccount = createAsyncThunk(
  'settings/update_account',
  async (account: any) => axios.post<any>(apiUrl, account),
  {
    serializeError: serializeAxiosError
  }
)

export const SettingsSlice = createSlice({
  name: 'settings',
  initialState: initialState as SettingsState,
  reducers: {
    reset() {
      return initialState
    }
  },
  extraReducers(builder) {
    builder
      .addCase(updateAccount.pending, state => {
        state.loading = true
        state.errorMessage = null
        state.updateSuccess = false
      })
      .addCase(updateAccount.rejected, state => {
        state.loading = false
        state.updateSuccess = false
        state.updateFailure = true
      })
      .addCase(updateAccount.fulfilled, state => {
        state.loading = false
        state.updateSuccess = true
        state.updateFailure = false
        state.successMessage = 'Settings saved!'
      })
  }
})

export const { reset } = SettingsSlice.actions

// Reducer
export default SettingsSlice.reducer
