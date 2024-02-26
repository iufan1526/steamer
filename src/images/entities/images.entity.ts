import { BaseEntity } from 'src/common/entities/base.entity';
import { GamesEntity } from 'src/games/entities/games.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('images')
export class ImagesEntity extends BaseEntity {
    @Column({ name: 'image_url' })
    imageUrl: string;

    @ManyToOne(() => GamesEntity, (game: GamesEntity) => game.images)
    game: GamesEntity;
}
