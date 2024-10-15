import { EAction } from "src/common/enums/action.enum";

export interface IPermission {
  id: string;
  title: string;
  action: EAction;
  subject: string;
  condition: string;
  active: boolean;
  createdAt: Date;
}
