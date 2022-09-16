import { IRoom } from 'app/shared/model/room.model';

export interface IBedroomKind {
  id?: number;
  name?: string;
  description?: string | null;
  rooms?: IRoom[] | null;
}

export const defaultValue: Readonly<IBedroomKind> = {};
