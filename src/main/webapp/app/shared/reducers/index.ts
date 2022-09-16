import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import authentication, { AuthenticationState } from './authentication';
import applicationProfile, { ApplicationProfileState } from './application-profile';

import administration, { AdministrationState } from 'app/modules/administration/administration.reducer';
import userManagement, { UserManagementState } from 'app/modules/administration/user-management/user-management.reducer';
import register, { RegisterState } from 'app/modules/account/register/register.reducer';
import activate, { ActivateState } from 'app/modules/account/activate/activate.reducer';
import password, { PasswordState } from 'app/modules/account/password/password.reducer';
import settings, { SettingsState } from 'app/modules/account/settings/settings.reducer';
import passwordReset, { PasswordResetState } from 'app/modules/account/password-reset/password-reset.reducer';
// prettier-ignore
import reservation from 'app/entities/reservation/reservation.reducer';
// prettier-ignore
import customer from 'app/entities/customer/customer.reducer';
// prettier-ignore
import pricing from 'app/entities/pricing/pricing.reducer';
// prettier-ignore
import bed from 'app/entities/bed/bed.reducer';
// prettier-ignore
import room from 'app/entities/room/room.reducer';
// prettier-ignore
import bedroomKind from 'app/entities/bedroom-kind/bedroom-kind.reducer';
// prettier-ignore
import requestReservation from 'app/entities/reservation-request/reservation-request.reducer';
// prettier-ignore
import place from 'app/entities/place/place.reducer';
// prettier-ignore
import bookingBeds from 'app/entities/bookingbeds/reservation.reducer';
// prettier-ignore
import meal from 'app/entities/meal/meal.reducer';
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
