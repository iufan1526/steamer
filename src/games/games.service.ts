import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { GET_GAMES_BY_STEAM_URL, GET_GAME_DETAIL_BY_STEAM_URL } from './const/api-url.const';
import { RawGames } from './dto/raw-game.dto';
import { GamesEntity } from './entities/games.entity';
import { CreateGame } from './dto/create-game.dto';

@Injectable()
export class GamesService {
    constructor(private readonly httpService: HttpService) {}

    async createGames() {
        const rawGames = await this.httpService.axiosRef.get(GET_GAMES_BY_STEAM_URL);
        const { apps } = rawGames.data.applist;
        let test: GamesEntity[];

        for (let i = 0; i < 40; i++) {
            if (apps[i].name) {
                const gameDetail = await this.httpService.axiosRef.get(GET_GAME_DETAIL_BY_STEAM_URL + apps[i].appid);

                if (gameDetail.data[apps[i].appid].success && !gameDetail.data[apps[i].appid].data.is_free) {
                    const { data } = gameDetail.data[apps[i].appid];
                    // const newObj = new CreateGame({
                    //     name: data.name,
                    //     appId: data.steam_appid,
                    // });
                    console.log({
                        name: data.name,
                        appId: data.steam_appid,
                        images: {
                            header_image: data.steam_appid,
                        },
                        minimumRequirement: data.pc_requirements.minimum,
                    });
                }
            }
        }

        // const arrayTest = apps.map(async (game: RawGames) => {
        //     if (game.name) {
        //         const gameDetail = await this.httpService.axiosRef.get(`GET_GAME_DETAIL_BY_STEAM_URL${game.appid}`);

        //         if (gameDetail.data.success) {
        //             return gameDetail.data;
        //         }
        //     }
        // });
    }

    async getAllgames(orderBy: string, genre: string) {}
}
