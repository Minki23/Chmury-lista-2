import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class AddTechnologiesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @Type(() => String)
  technologies: string[];
}
