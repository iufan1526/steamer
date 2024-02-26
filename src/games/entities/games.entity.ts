import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from 'src/common/entity/base.entity';
import { genresEntity } from 'src/genres/entities/genres.entity';
import { imagesEntity } from 'src/images/entities/images.entity';
import { SalesEntity } from 'src/sales/entities/sales.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('games')
export class GamesEntity extends BaseEntity {
    @Column({ name: 'app_id' })
    @IsNotEmpty()
    appId: number;

    @Column()
    @IsNotEmpty()
    name: string;

    @Column()
    @IsNotEmpty()
    thumnail: string;

    @Column()
    @IsNotEmpty()
    score: number;

    @Column({ name: 'is_possible_multi' })
    @IsNotEmpty()
    isPossibleMulti: boolean;

    @Column()
    @IsNotEmpty()
    recommentation: number;

    @Column({ name: 'is_window' })
    @IsNotEmpty()
    isWindow: boolean;

    @Column({ name: 'is_mac' })
    @IsNotEmpty()
    isMac: boolean;

    @Column({ name: 'is_linux' })
    @IsNotEmpty()
    isLinux: boolean;

    @Column()
    @IsNotEmpty()
    minimumRequirement: string;

    @OneToMany(() => SalesEntity, (sales) => sales.game)
    sales: SalesEntity[];

    @OneToMany(() => genresEntity, (genres: genresEntity) => genres.game)
    genres: genresEntity[];

    @OneToMany(() => imagesEntity, (image: imagesEntity) => image.game)
    images: imagesEntity[];
}
