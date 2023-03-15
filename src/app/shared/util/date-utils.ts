import 'dayjs/locale/fr'

import { APP_LOCAL_DATETIME_FORMAT } from 'app/config/constants'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

dayjs.locale('fr')
export const convertDateTimeFromServer = (
  date: string | undefined
): string | null => (date ? dayjs(date).format(APP_LOCAL_DATETIME_FORMAT) : null)

export const convertDateTimeToServer = (
  date: string | undefined
): Date | null => (date ? dayjs(date).toDate() : null)

export const displayDefaultDateTime = (): string =>
  dayjs().startOf('day').format(APP_LOCAL_DATETIME_FORMAT)

export const getDateKey = (date: Dayjs): string => dayjs(date).format('YYYY-MM-DD')
