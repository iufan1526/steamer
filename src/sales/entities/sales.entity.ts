import { BaseEntity } from '../../common/entities/base.entity';
import { GamesEntity } from 'src/games/entities/games.entity';
import { GenresEntity } from 'src/genres/entities/genres.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('sales')
export class SalesEntity extends BaseEntity {
    @Column({
        name: 'origin_price',
    })
    originPrice: number;

    @Column({
        name: 'discount_price',
    })
    discountPrice: number;

    @Column({
        name: 'discount_percent',
    })
    discountPercent: number;

    @ManyToOne(
        () => GamesEntity,
        (game: GamesEntity) => {
            game.sales;
        },
    )
    game: GamesEntity;
}
