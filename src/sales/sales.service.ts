import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SalesEntity } from './entities/sales.entity';

@Injectable()
export class SalesService {
    constructor(private readonly salesRepository: Repository<SalesEntity>) {}

    async getAllGames() {
        await this.salesRepository.find();
    }
}
