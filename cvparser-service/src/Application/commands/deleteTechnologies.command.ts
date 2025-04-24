import { ICommand } from '@nestjs/cqrs';

export class DeleteTechnologiesCommand implements ICommand {
    constructor(
        public readonly technologies: string[],
    ) {}
}