import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { GET_GAMES_BY_STEAM_URL, GET_GAME_DETAIL_BY_STEAM_URL } from './const/api-url.const';
import { GamesEntity } from './entities/games.entity';
import { FindManyOptions, FindOneOptions, FindOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SalesEntity } from 'src/sales/entities/sales.entity';
import { GenresEntity } from 'src/genres/entities/genres.entity';
import { ImagesEntity } from 'src/images/entities/images.entity';
import { RedisService } from 'src/redis/redis.service';
import { RawGamesEntity } from './entities/raw-games.entity';

@Injectable()
export class GamesService {
    constructor(
        private readonly httpService: HttpService,
        @InjectRepository(GamesEntity)
        private readonly gamesRepository: Repository<GamesEntity>,
        @InjectRepository(SalesEntity)
        private readonly salesRepository: Repository<SalesEntity>,
        @InjectRepository(RawGamesEntity)
        private readonly rawGamesRepository: Repository<RawGamesEntity>,
        private readonly redisService: RedisService,
    ) {}

    // async createGames(appId: number) {
    //     const rawGames = await this.httpService.axiosRef.get(GET_GAMES_BY_STEAM_URL);
    //     const { apps } = rawGames.data.applist;
    //     let count = 0;

    //     let startTime = Date.now();
    //     let startMin = Date.now();
    //     let count2 = 0;
    //     for (let i = 0; i < 202; i++) {
    //         if (apps[i].name) {
    //             const { data } = await this.httpService.axiosRef.get(
    //                 `${GET_GAME_DETAIL_BY_STEAM_URL}${apps[i].appid}&l=korean`,
    //             );

    //             const currentTime = Date.now();
    //             if (currentTime - startTime >= 1000) {
    //                 console.log(`초당요청수 ${count}`);
    //                 startTime = currentTime;
    //                 count = 0;
    //             }
    //             count++;

    //             const currentTime2 = Date.now();
    //             if (currentTime2 - startMin >= 1000 * 60) {
    //                 console.log(`분당요청수 ${count2}`);
    //                 startMin = currentTime2;
    //                 count2 = 0;
    //             }
    //             console.log(`총합 ${count2}`);
    //             count2++;

    // if (
    //     data[apps[i].appid].success &&
    //     !data[apps[i].appid].data.is_free &&
    //     !data[apps[i].appid].data.release_date.coming_soon &&
    //     data[apps[i].appid].data.type === 'game'
    // ) {
    //     const game = data[apps[i].appid].data;

    //                 const newObj = this.gamesRepository.create({
    //                     name: game.name,
    //                     appId: game.steam_appid,
    //                     thumnail: game.header_image,
    //                     score: game.metacritic ? game.metacritic.score : 0,
    //                     recommentation: game.recommendations ? game.recommendations.total : 0,
    //                     isWindow: game.platforms.windows,
    //                     isLinux: game.platforms.linux,
    //                     isMac: game.platforms.mac,
    //                     movieUrl: game.movies ? game.movies[0].webm.max : null,
    //                     releaseDate: game.release_date.date,
    //                     minimumRequirement: game.pc_requirements
    //                         ? game.pc_requirements.minimum
    //                             ? this.deleteHtmlTag(game.pc_requirements.minimum)
    //                             : null
    //                         : null,
    //                     discription: this.deleteHtmlTag(game.detailed_description),
    //                     supportedLanguages: this.deleteHtmlTag(game.supported_languages),
    //                 });

    //                 /**
    //                  * 멀티플레이 지원여부
    //                  */
    //                 if (game.categories) {
    //                     game.categories.forEach((cate: { id: number }) => {
    //                         cate.id === 1 ? (newObj.isPossibleMulti = true) : (newObj.isPossibleMulti = false);
    //                     });
    //                 }

    //                 /**
    //                  * 장르 추가
    //                  */
    //                 if (game.genres) {
    //                     const genres: GenresEntity[] = game.genres.map((genre: { description: string }) => {
    //                         return { genre: genre.description };
    //                     });
    //                     newObj.genres = genres;
    //                 }

    //                 /**
    //                  * 사진 추가
    //                  */
    //                 if (game.screenshots) {
    //                     const screenshots: ImagesEntity[] = game.screenshots.map((image: { path_full: string }) => {
    //                         return { imageUrl: image.path_full };
    //                     });
    //                     newObj.images = screenshots;
    //                 }

    //                 /**
    //                  * 가격 추가
    //                  */
    //                 if (game.price_overview) {
    //                     if (game.price_overview.discount_percent > 0) {
    //                         const sale = this.salesRepository.create({
    //                             originPrice: this.spliceMoney(game.price_overview.initial),
    //                             discountPrice: this.spliceMoney(game.price_overview.final),
    //                             discountPercent: game.price_overview.discount_percent,
    //                         });

    //                         newObj.sales = [sale];
    //                     }
    //                 }

    //                 await this.gamesRepository.save(newObj);
    //             }
    //         }
    //     }
    // }

    async detailGame(appId: number) {
        const { data } = await this.httpService.axiosRef.get(`${GET_GAME_DETAIL_BY_STEAM_URL}${appId}&l=korean`);

        return data;
    }

    async createGame(game: any, appId: string) {
        const gameDetail = game[appId];

        if (
            gameDetail.success &&
            !gameDetail.data.is_free &&
            !gameDetail.data.release_date.coming_soon &&
            gameDetail.data.type === 'game'
        ) {
            const game = gameDetail.data;

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
                        ? this.deleteHtmlTag(game.pc_requirements.minimum)
                        : null
                    : null,
                discription: this.deleteHtmlTag(game.detailed_description),
                supportedLanguages: this.deleteHtmlTag(game.supported_languages),
            });

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
                        originPrice: this.spliceMoney(game.price_overview.initial),
                        discountPrice: this.spliceMoney(game.price_overview.final),
                        discountPercent: game.price_overview.discount_percent,
                    });

                    newObj.sales = [sale];
                }
            }

            await this.gamesRepository.save(newObj);
        }
    }

    /**
     * 모든 게임데이터 저장
     */
    async rawGamesSave() {
        const rawGames = await this.httpService.axiosRef.get(GET_GAMES_BY_STEAM_URL);
        const { apps } = rawGames.data.applist;

        let count = 0;
        const newGames: RawGamesEntity[] = apps.map((game) => {
            return {
                id: ++count,
                appId: game.appid,
            };
        });

        for (let i = 0; i < newGames.length; i++) {
            await this.rawGamesRepository.save(newGames[i]);
        }
    }

    /**
     * 게임 저장하는 프로세스
     */
    async saveGamesProcess() {
        await this.redisService.setWorker(1);
        const worker = await this.redisService.getWorker();

        if (parseInt(worker) === 1) {
            const app = await this.rawGamesRepository.findOne({
                order: {
                    id: 'DESC',
                },
                where: {},
            });

            const gameDetailData = await this.detailGame(app.appId);

            await this.createGame(gameDetailData, app.appId.toString());

            await this.deleteGame(app.appId);

            await this.redisService.setWorker(2);

            const length = await this.rawGamesRepository.count();
            if (length > 0) {
                this.saveGamesProcess();
            }
        } else {
            this.saveGamesProcess();
        }

        console.log('데이터 저장이 성공하였습니다');

        return true;
    }

    /**
     * rawGame 삭제
     * @param appId
     */
    async deleteGame(appId: number) {
        await this.gamesRepository.softDelete({ appId });
    }

    /**
     * 가격 0두자리 없애고 반환
     * @param money
     * @returns
     */
    spliceMoney(money: number) {
        const stringMoney = money.toString();
        return parseInt(stringMoney.substring(0, stringMoney.length - 2));
    }

    /**
     * html태그 제거후 반환
     * @param str
     * @returns
     */
    deleteHtmlTag(str: string) {
        console.log('문자 자르기', str);
        return str.replace(/<[^>]*>/g, '');
    }

    sleep(sec: number) {
        return new Promise((resolve) => setTimeout(resolve, sec));
    }
}
