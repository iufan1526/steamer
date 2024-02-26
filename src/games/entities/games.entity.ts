import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from 'src/common/entity/base.entity';
import { Column, Entity } from 'typeorm';

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
}
