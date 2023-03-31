// const config = {
//   VERSION: process.env.VERSION
// }

// export default config

const BACK_END_PORT = 8080

export const SERVER_API_URL = (() => {
  switch (window.location.hostname) {
    case 'localhost':
      return `http://localhost:${BACK_END_PORT}`
    case '127.0.0.1':
      return `http://localhost:${BACK_END_PORT}`
    case 'prod.campus.ilieff.fr':
      return `https://prod.backend.campus.ilieff.fr`
    case 'hebergement.campus-transition.org':
      return `https://backend.hebergement.campus-transition.org`
    default:
      return `https://dev.backend.campus.ilieff.fr`
  }
})()

console.log(SERVER_API_URL)
export const AUTHORITIES = {
  ADMIN: 'ROLE_ADMIN',
  USER: 'ROLE_USER', // todo: tbc
  RESPHEBERGEMENT: 'ROLE_RESPHEBERGEMENT',
  COOKER: 'ROLE_COOKER',
  INTERMITTENT: 'ROLE_INTERMITTENT'
  // HABITANT: 'ROLE_HABITANT'
  // VOLONTAIRE: 'ROLE_VOLONTAIRE' // todo: tbc
}

export const messages = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  DATA_ERROR_ALERT: 'Internal Error'
}

export const APP_DATE_FORMAT = 'DD/MM/YY HH:mm'
export const APP_TIMESTAMP_FORMAT = 'DD/MM/YY HH:mm:ss'
export const APP_LOCAL_DATE_FORMAT = 'DD/MM/YYYY'
export const APP_LOCAL_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm'
export const APP_LOCAL_DATETIME_FORMAT_Z = 'YYYY-MM-DDTHH:mm Z'
export const APP_WHOLE_NUMBER_FORMAT = '0,0'
export const APP_TWO_DIGITS_AFTER_POINT_NUMBER_FORMAT = '0,0.[00]'
