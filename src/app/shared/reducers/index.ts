import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import authentication, { AuthenticationState } from './authentication';
import applicationProfile, { ApplicationProfileState } from './application-profile';

import administration, { AdministrationState } from '../../modules/administration/administration.reducer';
import userManagement, { UserManagementState } from '../../modules/administration/user-management/user-management.reducer';
import register, { RegisterState } from '../../modules/account/register/register.reducer';
import activate, { ActivateState } from '../../modules/account/activate/activate.reducer';
import password, { PasswordState } from '../../modules/account/password/password.reducer';
import settings, { SettingsState } from '../../modules/account/settings/settings.reducer';
import passwordReset, { PasswordResetState } from '../../modules/account/password-reset/password-reset.reducer';
// prettier-ignore
import reservation from '../../entities/reservation/reservation.reducer';
// prettier-ignore
import customer from '../../entities/customer/customer.reducer';
// prettier-ignore
import pricing from '../../entities/pricing/pricing.reducer';
// prettier-ignore
import bed from '../../entities/bed/bed.reducer';
// prettier-ignore
import room from '../../entities/room/room.reducer';
// prettier-ignore
import bedroomKind from '../../entities/bedroom-kind/bedroom-kind.reducer';
// prettier-ignore
import requestReservation from '../../entities/reservation-request/reservation-request.reducer';
// prettier-ignore
import place from '../../entities/place/place.reducer';
// prettier-ignore
import bookingBeds from '../../entities/bookingbeds/reservation.reducer';
// prettier-ignore
import meal from '../../entities/meal/meal.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const rootReducer = {
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
  meal,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
  loadingBar,
};

export default rootReducer;
