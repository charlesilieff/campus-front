import { AnyAction, configureStore, ThunkAction } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { loadingBarMiddleware } from 'react-redux-loading-bar'

import reducer from '../shared/reducers'
import errorMiddleware from './error-middleware'
import loggerMiddleware from './logger-middleware'
import notificationMiddleware from './notification-middleware'

const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.config', 'payload.request', 'error', 'meta.arg']
      }
    }).concat(errorMiddleware, notificationMiddleware, loadingBarMiddleware(), loggerMiddleware)
})

const getStore = () => store

export type IRootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>()
export type AppThunk<ReturnType = void,> = ThunkAction<ReturnType, IRootState, unknown, AnyAction>

export default getStore
