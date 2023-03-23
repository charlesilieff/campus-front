/* eslint-disable simple-import-sort/imports */
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar'

import bed from '../../entities/bed/bed.reducer'
import bedroomKind from '../../entities/bedroom-kind/bedroom-kind.reducer'
import bookingBeds from '../../entities/bookingbeds/booking-beds.reducer'
import customer from '../../entities/customer/customer.reducer'
import place from '../../entities/place/place.reducer'
import pricing from '../../entities/pricing/pricing.reducer'
import requestReservation from '../../entities/reservation-request/reservation-request.reducer'
import reservation from '../../entities/reservation/reservation.reducer'
import room from '../../entities/room/room.reducer'
import typeReservation from '../../entities/type-reservation/type-reservation.reducer'
import userCategory from '../../entities/user-category/user-category.reducer'
import activate from '../../modules/account/activate/activate.reducer'
import passwordReset from '../../modules/account/password-reset/password-reset.reducer'
import password from '../../modules/account/password/password.reducer'
import register from '../../modules/account/register/register.reducer'
import settings from '../../modules/account/settings/settings.reducer'
import administration from '../../modules/administration/administration.reducer'
import userManagement from '../../modules/administration/user-management/user-management.reducer'
import applicationProfile from './application-profile'
import authentication from './authentication'

export const rootReducer = {
  authentication,
  applicationProfile,
  administration,
  userManagement,
  register,
  activate,
  passwordReset,
  password,
  settings,
  reservation,
  customer,
  pricing,
  bed,
  room,
  bedroomKind,
  requestReservation,
  bookingBeds,
  place,
  loadingBar,
  userCategory,
  typeReservation
}
