import { Controller, Get, Query } from '@nestjs/common';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
    constructor(private readonly gamesService: GamesService) {}

    @Get()
    async test() {
        //this.gamesService.rawGamesSave();
        this.gamesService.saveGamesProcess();
    }

    @Get('appId')
    async test1() {
        //return this.gamesService.getAppId();
    }
}
