import { IRoom } from 'app/shared/model/room.model';

export interface IPlace {
  id?: number;
  name?: string;
  comment?: string | null;
  imageContentType?: string | null;
  image?: string | null;
  rooms?: IRoom[] | null;
}

export const defaultValue: Readonly<IPlace> = {};
