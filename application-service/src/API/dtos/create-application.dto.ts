export class CreateApplicationDto {
  position: string;
  resume: {
    text: string;
    filename: string;
  };
} 