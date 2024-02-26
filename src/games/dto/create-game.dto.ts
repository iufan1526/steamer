import { PickType } from '@nestjs/mapped-types';
import { GamesEntity } from '../entities/games.entity';
import { ImagesEntity } from 'src/images/entities/images.entity';
import { GenresEntity } from 'src/genres/entities/genres.entity';

export class CreateGame extends PickType(GamesEntity, [
    'appId',
    'isLinux',
    'isMac',
    'isPossibleMulti',
    'isWindow',
    'minimumRequirement',
    'name',
    'recommentation',
]) {
    images: ImagesEntity[];

    genres: GenresEntity[];
}
