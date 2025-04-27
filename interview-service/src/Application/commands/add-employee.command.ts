export class AddEmployeeCommand {
    constructor(
        public readonly name: string,
        public readonly position: string,
        public readonly phone: string,
        public readonly email: string,
        public readonly proficientTechnologies: string[],
    ) {}
}
