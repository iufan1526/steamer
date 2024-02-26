import { BaseEntity } from 'src/common/entities/base.entity';
import { GamesEntity } from 'src/games/entities/games.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
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
        (game) => {
            game.sales;
        },
    )
    game: GamesEntity;
}
