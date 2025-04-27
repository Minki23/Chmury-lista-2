import { ICommandHandler, CommandHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPositionsQuery } from '../queries/get-positions.query';
import { PositionsRepository } from '../../Infrastructure/database/repositories/positions.repository';
import { Inject } from '@nestjs/common';

@QueryHandler(GetPositionsQuery)
export class GetPositionsHandler implements ICommandHandler<GetPositionsQuery> {
    constructor(
        @Inject('IPositionsRepository')
        private readonly positionsRepository: PositionsRepository,
    ) {}

    async execute(command: GetPositionsQuery): Promise<any> {
        try {
            const positions = await this.positionsRepository.getAll();
            return positions;
        } catch (error) {
            throw new Error(`Failed to get positions: ${error.message}`);
        }
    }
}