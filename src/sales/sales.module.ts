import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesEntity } from 'src/games/entities/games.entity';
import { SalesEntity } from './entities/sales.entity';

@Module({
    imports: [TypeOrmModule.forFeature([GamesEntity, SalesEntity])],
    controllers: [SalesController],
    providers: [SalesService],
})
export class SalesModule {}
