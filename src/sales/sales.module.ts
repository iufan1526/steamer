import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesEntity } from 'src/games/entities/games.entity';
import { SalesEntity } from './entities/sales.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [TypeOrmModule.forFeature([GamesEntity, SalesEntity]), HttpModule],
    controllers: [SalesController],
    providers: [SalesService],
})
export class SalesModule {}
