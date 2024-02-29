import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis from 'ioredis';

@Injectable()
export class RedisService {
    private readonly redisClient: IORedis;

    constructor(private readonly configService: ConfigService) {
        this.redisClient = new IORedis({
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
            password: configService.get<string>('REDIS_PASSWORD'),
        });

        this.redisClient.on('connect', () => {
            console.log('redis 데이터베이스가 정상적으로 연결되었습니다.');
        });

        this.redisClient.on('error', () => {
            console.log('redis연결중에 오류가 발생하였습니다.');
        });
    }

    async setRawGameList(appId: number[]) {
        await this.redisClient.rpush('appList', ...appId);
    }

    async getRawGameList() {
        return await this.redisClient.lrange('appList', 0, -1);
    }

    async setWorker(pcId: number) {
        return await this.redisClient.set('worker', pcId);
    }

    async getWorker() {
        return await this.redisClient.get('worker');
    }
}
