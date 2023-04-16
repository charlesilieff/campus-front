import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

import { serializeAxiosError } from './reducer.utils'

const initialState = {
  ribbonEnv: '',
  inProduction: true,
  isOpenAPIEnabled: false
}

interface Profiles {
  activeProfiles: string[]
}

export type ApplicationProfileState = Readonly<typeof initialState>

export const getProfile = createAsyncThunk(
  'applicationProfile/get_profile',
  async () => axios.get<Profiles>('management/info'),
  {
    serializeError: serializeAxiosError
  }
)

export const ApplicationProfileSlice = createSlice({
  name: 'applicationProfile',
  initialState: initialState as ApplicationProfileState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getProfile.fulfilled, (state, action) => {
      console.log('aaaaction', action)
      const { data } = action.payload
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      state.ribbonEnv = data['display-ribbon-on-profiles']
      state.inProduction = data.activeProfiles?.includes('prod')
    })
  }
})

// Reducer
// eslint-disable-next-line import/no-default-export
export default ApplicationProfileSlice.reducer
