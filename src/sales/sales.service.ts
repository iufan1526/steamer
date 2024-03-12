import { Injectable, NotFoundException } from '@nestjs/common';
import { FindManyOptions, FindOptions, Repository } from 'typeorm';
import { SalesEntity } from './entities/sales.entity';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { HttpService } from '@nestjs/axios';
import { GET_GAME_DETAIL_BY_STEAM_URL } from 'src/games/const/api-url.const';

@Injectable()
export class SalesService {
    constructor(
        private readonly httpService: HttpService,
        @InjectRepository(SalesEntity)
        private readonly salesRepository: Repository<SalesEntity>,
    ) {}

    /**
     * 게임 전체조회
     * 이름, 가격정보, 할인율, 장르로 걸러짐.
     * @returns processedGames
     */

    async getAllGames(queryparam: searchType) {
        console.log(queryparam);

        const take: number = 3;
        const page: number = queryparam.page || 1;
        const skip: number = (page - 1) * take;

        const totalCount = await this.salesRepository.count();

        const options: FindManyOptions<SalesEntity> = {
            where: {
                game: {
                    genres: {
                        genre: queryparam.genre,
                    },
                },
            },
            order: {
                discountPercent: queryparam.discountPercent,
            },

            relations: { game: { genres: true } },
            take,
            skip,
        };
        const filterdGame = await this.salesRepository.find(options);

        return {
            data: filterdGame,
            meta: {
                totalCount,
                take,
                skip,
                page,
                lastPage: Math.ceil(totalCount / take),
                // 전체수에서 페이지당 갯수를 나눈뒤 올림처리. ex) 10 / 3 = 3이나 올림처리하여 총페이지는 4페이지 처리가 된다.
                // 프론트에서 데이터가 끝나는 지점.
            },
        };
    }

    /**
     * @param id
     * @returns
     */
    async getGameById(gameId: number) {
        const foundGame = await this.salesRepository.findOne({
            where: {
                id: gameId,
            },
            relations: { game: { genres: true, images: true } },
        });

        if (!gameId) {
            throw new NotFoundException();
        }
        return foundGame;
    }

    async checkSaleGames() {
        const allSalesGame = await this.salesRepository.find({ relations: ['game'] });

        for (let i = 0; i < allSalesGame.length; i++) {
            const sale = allSalesGame[i].game;

            const result = await this.httpService.axiosRef.get(`${GET_GAME_DETAIL_BY_STEAM_URL}${sale.appId}`);

            const discountPercent = result.data.discountPercent;

            // 할인이 없는 경우 해당 판매를 삭제합니다.
            if (discountPercent <= 0 || !discountPercent) {
                await this.softDeleteSale(sale.id);
            }
        }
    }

    async softDeleteSale(id: number) {
        await this.salesRepository.softDelete(id);
    }
}

export interface searchType {
    genre?: string;
    discountPercent?: 'asc' | 'desc';
    discountPrice?: 'asc' | 'desc';
    page: number;
}
// 유닛테스트 : method의 기능을 테스트하는것.
// jest문서나 블로그 참조해서 테스트코드 작성해볼 것.
