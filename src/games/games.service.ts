import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { GET_GAMES_BY_STEAM_URL, GET_GAME_DETAIL_BY_STEAM_URL } from './const/api-url.const';
import { GamesEntity } from './entities/games.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SalesEntity } from 'src/sales/entities/sales.entity';
import { GenresEntity } from 'src/genres/entities/genres.entity';
import { ImagesEntity } from 'src/images/entities/images.entity';

@Injectable()
export class GamesService {
    constructor(
        private readonly httpService: HttpService,
        @InjectRepository(GamesEntity)
        private readonly gamesRepository: Repository<GamesEntity>,
        @InjectRepository(SalesEntity)
        private readonly salesRepository: Repository<SalesEntity>,
    ) {}

    async createGames() {
        const rawGames = await this.httpService.axiosRef.get(GET_GAMES_BY_STEAM_URL);
        const { apps } = rawGames.data.applist;
        let count = 0;

        for (let i = 0; i < 10000; i++) {
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
                        movieUrl: game.movies ? game.movies[0].webm.max : null,
                        releaseDate: game.release_date.date,
                        minimumRequirement: game.pc_requirements
                            ? game.pc_requirements.minimum
                                ? game.pc_requirements.minimum
                                : ''
                            : '',
                    });

                    /**
                     * 멀티플레이 지원여부
                     */
                    if (game.categories) {
                        game.categories.forEach((cate: { id: number }) => {
                            cate.id === 1 ? (newObj.isPossibleMulti = true) : (newObj.isPossibleMulti = false);
                        });
                    }

                    /**
                     * 장르 추가
                     */
                    if (game.genres) {
                        const genres: GenresEntity[] = game.genres.map((genre: { description: string }) => {
                            return { genre: genre.description };
                        });
                        newObj.genres = genres;
                    }

                    /**
                     * 사진 추가
                     */
                    if (game.screenshots) {
                        const screenshots: ImagesEntity[] = game.screenshots.map((image: { path_full: string }) => {
                            return { imageUrl: image.path_full };
                        });
                        newObj.images = screenshots;
                    }

                    /**
                     * 가격 추가
                     */
                    if (game.price_overview) {
                        if (game.price_overview.discount_percent > 0) {
                            const sale = this.salesRepository.create({
                                originPrice: game.price_overview.initial,
                                discountPrice: game.price_overview.final,
                                discountPercent: game.price_overview.discount_percent,
                            });

                            newObj.sales = [sale];
                        }
                    }

                    await this.gamesRepository.save(newObj);

                    if (i % 200 === 0 && i !== 0) {
                        console.log(`${i}번째 지연시작`);
                        await this.sleep(1000 * 60 * 3);
                    }

                    console.log(newObj);
                }
            }
        }
    }

    async getAllgames(orderBy: string, genre: string) {}

    sleep = (sec: number) => {
        return new Promise((resolve) => setTimeout(resolve, sec));
    };
}
