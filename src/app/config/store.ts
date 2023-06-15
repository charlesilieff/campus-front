import type { AnyAction, ThunkAction } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import type { TypedUseSelectorHook } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux'
import { loadingBarMiddleware } from 'react-redux-loading-bar'

import { rootReducer } from '../shared/reducers'
import errorMiddleware from './error-middleware'
import loggerMiddleware from './logger-middleware'
import { handleError } from './notification-middleware'

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(errorMiddleware, handleError, loadingBarMiddleware(), loggerMiddleware)
})

export const getStore = () => store

export type IRootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>()
export type AppThunk<ReturnType = void,> = ThunkAction<ReturnType, IRootState, unknown, AnyAction>
