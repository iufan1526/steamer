import { Controller, Get } from '@nestjs/common';
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
        const apiUrl = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/';
        const result = await this.httpService.axiosRef.get(apiUrl);

        console.log(result.data);
    }
}
