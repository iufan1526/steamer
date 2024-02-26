import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesEntity } from './entities/games.entity';
import { HttpModule } from '@nestjs/axios';
import { SalesEntity } from 'src/sales/entities/sales.entity';

@Module({
    imports: [TypeOrmModule.forFeature([GamesEntity, SalesEntity]), HttpModule],
    controllers: [GamesController],
    providers: [GamesService],
})
export class GamesModule {}
