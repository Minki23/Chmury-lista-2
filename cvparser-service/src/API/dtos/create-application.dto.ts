import { IsEmail, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateApplicationDto {
  resume: {
    text: string;
    filename: string;
  };
} 