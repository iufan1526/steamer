import { Controller, Get, Query, Req } from '@nestjs/common';
import { SalesService, searchType } from './sales.service';

@Controller('sales')
export class SalesController {
    constructor(private readonly salesService: SalesService) {}

    @Get('games')
    getAllGames(@Query() filters: searchType) {
        // return this.salesService.getAllGames();
        return this.salesService.getAllGames(filters);
    }

    // 쿼리를 안보내면 getallgames, 보내면 filtered가 되도록 엔드포인트를 합쳐보기.
    @Get('game/:id')
    getGameById(id: number) {
        return this.salesService.getGameById(id);
    }
}
