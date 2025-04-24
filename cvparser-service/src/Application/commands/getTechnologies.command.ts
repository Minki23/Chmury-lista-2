import { ICommand } from '@nestjs/cqrs';

export class GetTechnologiesCommand implements ICommand {
    constructor() {}
}