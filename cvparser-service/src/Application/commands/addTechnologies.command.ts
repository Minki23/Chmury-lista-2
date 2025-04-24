import { ICommand } from '@nestjs/cqrs';

export class AddTechnologiesCommand implements ICommand {
    constructor(
        public readonly technologies: string[],
    ) {}
}