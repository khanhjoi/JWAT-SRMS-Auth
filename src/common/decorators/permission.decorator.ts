import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { EAction } from '../enums/action.enum';
import { PermissionObjectType } from 'src/casl/casl-ability.factory/casl-ability.factory';
// action, object
export type RequiredPermission = [EAction, PermissionObjectType];

export const PERMISSION_CHECKER_KEY = 'permission_checker_params_key';


export const CheckPermissions = (
  actions: [EAction, string][],
): CustomDecorator<string> => SetMetadata(PERMISSION_CHECKER_KEY, actions);