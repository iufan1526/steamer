import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GamesModule } from './games/games.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmCinfigService } from './config/database-config/typeorm.cofing';
import { ScheduleModule } from '@nestjs/schedule';
import { SalesModule } from './sales/sales.module';
import { GenresModule } from './genres/genres.module';
import { ImagesModule } from './images/images.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['./environment/.dev.env', './environment/.prod.env'],
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            useClass: TypeOrmCinfigService,
        }),
        ScheduleModule.forRoot(),
        GamesModule,
        SalesModule,
        GenresModule,
        ImagesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
