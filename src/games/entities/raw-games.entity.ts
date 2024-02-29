import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('raw_games')
export class RawGamesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'app_id' })
    @IsNotEmpty()
    appId: number;

    @DeleteDateColumn({
        name: 'deletead_at',
    })
    deletedAt: Date;
}
