import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { AppThunk } from 'app/config/store'
import { JwtTokenPayload, User } from 'app/shared/model/user.model'
import { getSession } from 'app/shared/reducers/authentication'
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils'
import { putHttpEntity } from 'app/shared/util/httpUtils'
import { Option as O } from 'effect'
import { castDraft } from 'immer'

const initialState = {
  loading: false,
  errorMessage: O.none<string>(),
  successMessage: O.none<string>(),
  updateSuccess: false,
  updateFailure: false
}

export type SettingsState = Readonly<typeof initialState>

// Actions
const apiUrl = 'api/account/update'

export const saveAccountSettings: (account: JwtTokenPayload) => AppThunk =
  account => async dispatch => {
    await dispatch(updateAccount(account))

    dispatch(getSession())
  }

export const updateAccount = createAsyncThunk(
  'settings/update_account',
  async (account: JwtTokenPayload) => putHttpEntity(apiUrl, JwtTokenPayload, account, User),
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
        state.errorMessage = castDraft(O.none())
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

        state.successMessage = O.some('Modification sauvegardée avec succès')
      })
  }
})

export const { reset } = SettingsSlice.actions

// Reducer
// eslint-disable-next-line import/no-default-export
export default SettingsSlice.reducer
