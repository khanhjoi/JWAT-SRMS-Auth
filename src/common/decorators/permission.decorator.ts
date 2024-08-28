import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { Action } from '../enums/action.enum';
import { PermissionObjectType } from 'src/casl/casl-ability.factory/casl-ability.factory';
// action, object
export type RequiredPermission = [Action, PermissionObjectType];

export const PERMISSION_CHECKER_KEY = 'permission_checker_params_key';


export const CheckPermissions = (
  actions: [Action, string][],
): CustomDecorator<string> => SetMetadata(PERMISSION_CHECKER_KEY, actions);