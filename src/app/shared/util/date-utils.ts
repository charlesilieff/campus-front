import { APP_LOCAL_DATETIME_FORMAT } from 'app/config/constants';
import 'dayjs/locale/fr';
import dayjs, { Dayjs } from 'dayjs';
dayjs.locale('fr');
export const convertDateTimeFromServer = date => (date ? dayjs(date).format(APP_LOCAL_DATETIME_FORMAT) : null);

export const convertDateTimeToServer = date => (date ? dayjs(date).toDate() : null);

export const displayDefaultDateTime = () => dayjs().startOf('day').format(APP_LOCAL_DATETIME_FORMAT);

export const getDateKey = (date: Dayjs) => dayjs(date).format('YYYY-MM-DD');
