import { BaseEntity } from 'src/common/entity/base.entity';
import { Entity } from 'typeorm';

@Entity('games')
export class GamesEntity extends BaseEntity {}
