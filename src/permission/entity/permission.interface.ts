import { Action } from "src/common/enums/action.enum";

export interface IPermission {
  id: string;
  title: string;
  action: Action;
  subject: string;
  condition: string;
  active: boolean;
  createdAt: Date;
}
