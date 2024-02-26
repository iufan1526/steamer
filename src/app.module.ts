import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GamesModule } from './games/games.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmCinfigService } from './config/database-config/typeorm.cofing';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['./environment/.dev.env', './environment/.prod.env'],
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            useClass: TypeOrmCinfigService,
        }),
        GamesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
