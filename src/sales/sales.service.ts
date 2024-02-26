import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SalesEntity } from './entities/sales.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SalesService {
    constructor(
        @InjectRepository(SalesEntity)
        private readonly salesRepository: Repository<SalesEntity>,
    ) {}

    dummyData = [
        {
            appId: 1573300,
            name: 'WISH - Paradise High',
            thumnail: 'https://cdn.akamai.steamstatic.com/steam/apps/1573300/header.jpg?t=1619506304',
            score: 0,
            movieUrl: 'http://cdn.akamai.steamstatic.com/steam/apps/256832326/movie_max_vp9.webm?t=1619506300',
            recommentation: 503,
            isWindow: true,
            isMac: false,
            isLinux: false,
            isPossibleMulti: false,
            genres: ['Action', 'Adventure', 'Casual', 'Indie'],
            images: [
                'https://cdn.akamai.steamstatic.com/steam/apps/1573300/ss_f23906a40116d4c8cc7c84cc5956c5d4aede13bf.1920x1080.jpg?t=1619506304',
                'https://cdn.akamai.steamstatic.com/steam/apps/1573300/ss_852875af94bf0c846024729b97fb748ff8d8018d.1920x1080.jpg?t=1619506304',
                'https://cdn.akamai.steamstatic.com/steam/apps/1573300/ss_869baa750b7ba2be39ada5e554aa16b91ec7aa39.1920x1080.jpg?t=1619506304',
                'https://cdn.akamai.steamstatic.com/steam/apps/1573300/ss_5168ffb286271f8e6bfddb9e4f25ef2300a3235e.1920x1080.jpg?t=1619506304',
                'https://cdn.akamai.steamstatic.com/steam/apps/1573300/ss_e97773e01a67226637d3821c0e047b3a4b46fbb0.1920x1080.jpg?t=1619506304',
                'https://cdn.akamai.steamstatic.com/steam/apps/1573300/ss_b591807988273526f2a5768579a0faa714b8d995.1920x1080.jpg?t=1619506304',
                'https://cdn.akamai.steamstatic.com/steam/apps/1573300/ss_7336a1576b8fea5245a7c74f7ec550ffe7693c5a.1920x1080.jpg?t=1619506304',
            ],
        },
        // sales entity
        {
            gameId: 10,
            originPrice: 30000,
            discountPercent: 30,
            discountPrice: 10000,
        },
    ];

    async getAllGames() {
        // sales repository에 있는 정보를 모두 찾는다.
        return await this.salesRepository.find({ relations: ['games'] });
    }

    async getFilterdGames(query) {}
}

/**
 * 1. game api에서 이름과 app id를 가지고온다.
 * 2. 우리가 원하는 정보만 새로운 obj를 만들어서 집어넣는다 (세일여부 상관X)
 * 3. 조건들을 삽입한다.
 * 4. if(game.data.discountPercent <= 1)
 */
