import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesEntity } from './entities/games.entity';
import { HttpModule } from '@nestjs/axios';
import { SalesEntity } from 'src/sales/entities/sales.entity';
import { GenresEntity } from 'src/genres/entities/genres.entity';
import { ImagesEntity } from 'src/images/entities/images.entity';
import { RedisService } from 'src/redis/redis.service';
import { RedisModule } from 'src/redis/redis.module';
import { RawGamesEntity } from './entities/raw-games.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([GamesEntity, SalesEntity, GenresEntity, ImagesEntity, RawGamesEntity]),
        HttpModule,
        RedisModule,
    ],
    controllers: [GamesController],
    providers: [GamesService],
})
export class GamesModule {}
