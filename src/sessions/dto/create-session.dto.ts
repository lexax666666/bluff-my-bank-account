import { IsString, IsUrl, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  userId: string;

  @IsUrl()
  greetingUrl: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1440) // Max 24 hours
  expiresInMinutes?: number;
}
