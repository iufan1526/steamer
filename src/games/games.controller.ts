import { Controller, Get, Query } from '@nestjs/common';
import { GamesService } from './games.service';
import { HttpService } from '@nestjs/axios';

@Controller('games')
export class GamesController {
    constructor(
        private readonly gamesService: GamesService,
        private readonly httpService: HttpService,
    ) {}

    @Get()
    async test() {
        this.gamesService.createGames();
    }

    @Get('games')
    async getAllGames(@Query('orderBy') orderBy: string, @Query('genre') genre: string) {
        return this.gamesService.getAllgames(orderBy, genre);
    }
}
