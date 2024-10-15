import { ForcedSubject, MongoAbility, Ability } from '@casl/ability';
import { EAction, ESubject } from 'src/common/enums/action.enum';

export const actions = [
  EAction.READ,
  EAction.MANAGER,
  EAction.WRITE,
  EAction.DELETE,
  EAction.DELETE,
] as const;

export const subjects = [...Object.values(ESubject), 'all'] as const;

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

// export type AppAbility = MongoAbility<Abilities>;
export type AppAbility = Ability<Abilities>;
