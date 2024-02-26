import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { GET_GAMES_BY_STEAM_URL, GET_GAME_DETAIL_BY_STEAM_URL } from './const/api-url.const';
import { GamesEntity } from './entities/games.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GamesService {
    constructor(
        private readonly httpService: HttpService,
        @InjectRepository(GamesEntity)
        private readonly gamesRepository: Repository<GamesEntity>,
    ) {}

    async createGames() {
        const rawGames = await this.httpService.axiosRef.get(GET_GAMES_BY_STEAM_URL);
        const { apps } = rawGames.data.applist;
        let test: GamesEntity[];

        for (let i = 0; i < 40; i++) {
            if (apps[i].name) {
                const { data } = await this.httpService.axiosRef.get(`${GET_GAME_DETAIL_BY_STEAM_URL}${apps[i].appid}`);

                if (
                    data[apps[i].appid].success &&
                    !data[apps[i].appid].data.is_free &&
                    !data[apps[i].appid].data.release_date['coming_soon']
                ) {
                    const game = data[apps[i].appid].data;

                    const newObj = this.gamesRepository.create({
                        name: game.name,
                        appId: game.steam_appid,
                        thumnail: game.header_image,
                        score: game.metacritic ? game.metacritic.score : 0,
                        recommentation: game.recommendations ? game.recommendations.total : 0,
                        isWindow: game.platforms.windows,
                        isLinux: game.platforms.linux,
                        isMac: game.platforms.mac,
                    });

                    /**
                     * 멀티플레이 지원여부
                     */
                    if (game.categories) {
                        game.categories.forEach((cate: { id: number }) => {
                            cate.id === 1 ? (newObj.isPossibleMulti = true) : (newObj.isPossibleMulti = false);
                        });
                    }

                    console.log(newObj);
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
