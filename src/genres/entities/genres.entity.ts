import { GamesEntity } from 'src/games/entities/games.entity';
import { BaseEntity, Column, Entity, ManyToOne } from 'typeorm';

@Entity('genre')
export class genresEntity extends BaseEntity {
    @Column({ name: 'genres' })
    genres: string;

    @ManyToOne(() => GamesEntity, (game: GamesEntity) => game.genres)
    game: GamesEntity;
}
