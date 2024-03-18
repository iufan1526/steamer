import { Controller, Get } from '@nestjs/common';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
    constructor(private readonly gamesService: GamesService) {}

    @Get()
    async test() {
        //this.gamesService.rawGamesSave();
        await this.gamesService.saveGamesProcess();
    }

    @Get('init')
    async setInitPcOrder() {
        return this.gamesService.initPcOrder();
    }
}
