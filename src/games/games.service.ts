import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { GET_GAMES_BY_STEAM_URL, GET_GAME_DETAIL_BY_STEAM_URL } from './const/api-url.const';
import { GamesEntity } from './entities/games.entity';
import { FindManyOptions, FindOneOptions, FindOptions, LegacyOracleNamingStrategy, Repository } from 'typeorm';
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

    async detailGame(appId: string) {
        try {
            let result = await this.httpService.axiosRef.get(`${GET_GAME_DETAIL_BY_STEAM_URL}${appId}&l=korean`);

            if (!result.data) {
                result = await this.httpService.axiosRef.get(`${GET_GAME_DETAIL_BY_STEAM_URL}${appId}`);
            }

            return result.data;
        } catch (err) {
            await this.deleteGame(+appId);

            return null;
        }
    }

    async createGame(game: any, appId: string) {
        const gameDetail = game[appId];

        console.log('raw 현재 게임 =>>>>>>>>>>>>>', appId);
        console.log('raw 현재 게임 =>>>>>>>>>>>>>', game[appId]);
        console.log('현재 게임 =>>>>>>>>>>>>>', gameDetail);
        //console.log('success 여부 =>>>> ', gameDetail.success);
        //console.log('data.is_free 여부 =>>>> ', !gameDetail.data.is_free);
        //console.log('gameDetail.data.type 여부 =>>>> ', gameDetail.data.type);
        console.log(gameDetail);

        if (!gameDetail) {
            this.deleteGame(+appId);
        }

        if (
            gameDetail.success &&
            !gameDetail.data.is_free &&
            !gameDetail.data.release_date.coming_soon &&
            gameDetail.data.type === 'game'
        ) {
            const game = gameDetail.data;
            console.log('게임이 맞습니다 게임등록 시작');
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
                discription: game.detailed_description ? this.deleteHtmlTag(game.detailed_description) : null,
                supportedLanguages: game.supported_languages ? this.deleteHtmlTag(game.supported_languages) : null,
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
            console.log('게임 저장의 성공하였습니다. ㅊㅋㅊㅋ');
        } else {
            console.log('게임이 아닙니다 삭제를 진행하겠습니다.');
            this.deleteGame(+appId);
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
        const worker = await this.redisService.getWorker();

        if (parseInt(worker) === 1) {
            const app = await this.rawGamesRepository.findOne({
                order: {
                    id: 'DESC',
                },
                where: {},
            });

            const gameDetailData = await this.detailGame(app.appId.toString());

            if (!gameDetailData) {
                await this.saveGamesProcess();
            }

            console.log('저장전 데이터 ', gameDetailData);
            await this.createGame(gameDetailData, app.appId.toString());

            await this.deleteGame(app.appId);

            await this.redisService.setWorker(2);

            const length = await this.rawGamesRepository.count();
            console.log('남은 데이터수: ', length);
            if (length > 0) {
                await this.saveGamesProcess();
            }
        } else {
            await this.saveGamesProcess();
        }

        console.log('데이터 저장이 모두 성공하였습니다');

        return true;
    }

    async initPcOrder() {
        await this.redisService.setWorker(1);
    }

    /**
     * rawGame 삭제
     * @param appId
     */
    async deleteGame(appId: number) {
        await this.rawGamesRepository.softDelete({ appId });
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
