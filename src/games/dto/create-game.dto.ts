import { OmitType, PickType } from '@nestjs/mapped-types';
import { GamesEntity } from '../entities/games.entity';

export class CreateGame extends PickType(GamesEntity, [
    'appId',
    'isLinux',
    'isMac',
    'isPossibleMulti',
    'isWindow',
    'minimumRequirement',
    'name',
    'recommentation',
]) {}
