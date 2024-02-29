import { BaseEntity } from 'src/common/entities/base.entity';
import { GamesEntity } from 'src/games/entities/games.entity';
import { SalesEntity } from 'src/sales/entities/sales.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('genres')
export class GenresEntity extends BaseEntity {
    @Column({ name: 'genre' })
    genre: string;

    @ManyToOne(() => GamesEntity, (game: GamesEntity) => game.genres)
    game: GamesEntity;
}
