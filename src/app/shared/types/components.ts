import { URLString } from './base';

export interface CardAction<T> {
  icon: URLString;
  label: string;
  action: (obj: T) => void;
}
