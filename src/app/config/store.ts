import type { AnyAction, ThunkAction } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import type { TypedUseSelectorHook } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux'
import { loadingBarMiddleware } from 'react-redux-loading-bar'

import { rootReducer } from '../shared/reducers'
import errorMiddleware from './error-middleware'
import loggerMiddleware from './logger-middleware'
import notificationMiddleware from './notification-middleware'

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.config', 'payload.request', 'error', 'meta.arg']
      }
    }).concat(errorMiddleware, notificationMiddleware, loadingBarMiddleware(), loggerMiddleware)
})

export const getStore = () => store

export type IRootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>()
export type AppThunk<ReturnType = void,> = ThunkAction<ReturnType, IRootState, unknown, AnyAction>
