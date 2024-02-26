import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from 'src/common/entities/base.entity';
import { GenresEntity } from 'src/genres/entities/genres.entity';
import { ImagesEntity } from 'src/images/entities/images.entity';
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

    @Column({
        name: 'movie_url',
        nullable: true,
    })
    movieUrl: string;

    @Column({ name: 'is_possible_multi', default: false })
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

    @Column({
        name: 'release_date',
        nullable: true,
    })
    releaseDate: Date;

    @Column({
        type: 'text',
    })
    @IsNotEmpty()
    minimumRequirement: string;

    @OneToMany(() => SalesEntity, (sales: SalesEntity) => sales.game, {
        cascade: true,
    })
    sales: SalesEntity[];

    @OneToMany(() => GenresEntity, (genres: GenresEntity) => genres.game, {
        cascade: true,
    })
    genres: GenresEntity[];

    @OneToMany(() => ImagesEntity, (image: ImagesEntity) => image.game, {
        cascade: true,
    })
    images: ImagesEntity[];
}
