import DateDecorator from "./date";
import { v4 as uuid } from "uuid";

type UserStatus = 'active' | 'deactive'

export interface UserDateProps {
  createdAt: DateDecorator;
  updatedAt: DateDecorator;
}

export interface UserParams {
  uuid: string;
  title: string;
  email: string;
  username: string;
  status: UserStatus;

  createdAt: string;
  updatedAt: string;
}

export class UserModel {
  readonly id: string;
  readonly _raw: UserParams;

  constructor(params: UserParams) {
    this.id = params.uuid || uuid();
    this._raw = params;

  }

  get raw() {
    return this._raw;
  }
}

export type User = UserParams & UserModel & UserDateProps;
