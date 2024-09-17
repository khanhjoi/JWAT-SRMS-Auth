import { ForcedSubject, MongoAbility } from '@casl/ability';
import { Action } from 'src/common/enums/action.enum';

export const actions = [
  Action.READ,
  Action.MANAGER,
  Action.WRITE,
  Action.DELETE,
  Action.DELETE,
] as const;

export const subjects = ['Route', 'User', 'all'] as const;

/**
 * Define all action and subjects in application
 */
export type Abilities = [
  (typeof actions)[number],
  (
    | (typeof subjects)[number]
    | ForcedSubject<Exclude<(typeof subjects)[number], 'all'>>
  ),
];

export type AppAbility = MongoAbility<Abilities>;
