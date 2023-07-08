import { Options } from '@nestjs/common';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @Length(3, 16, { message: 'invalid length', groups: ['create'] })
  @Length(5, 16, { message: 'invalid length', groups: ['update'] })
  @IsString()
  readonly name: string;
  @IsEmail(undefined, { message: 'invalid email' })
  readonly email: string;
}
