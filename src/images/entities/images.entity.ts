import { GamesEntity } from 'src/games/entities/games.entity';
import { BaseEntity, Column, Entity, ManyToOne } from 'typeorm';

@Entity('image')
export class imagesEntity extends BaseEntity {
    @Column({ name: 'image_url' })
    imageUrl: string;

    @ManyToOne(() => GamesEntity, (game: GamesEntity) => game.images)
    game: GamesEntity;
}
