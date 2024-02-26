import { Controller, Get, Query, Req } from '@nestjs/common';
import { SalesService } from './sales.service';

@Controller()
export class SalesController {
    constructor(private readonly salesService: SalesService) {}

    @Get('games')
    getAllGames(game) {
        return this.salesService.getAllGames();
    }

    @Get()
    getFilterdGames(@Query() query: string, @Req() req: any) {
        const { genre, isWindow, isMac, isLinux, score, recommentation, originPrice, discountPrice } = req.query;

        return this.salesService.getFilterdGames(Query);
    }
}
