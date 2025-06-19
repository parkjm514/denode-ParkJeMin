import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class SignAdministratorDto {
  @ApiProperty({
    description: '계정 이메일',
    example: 'test1234@gmail.com',
    required: true,
  })
  @IsString()
  @Length(5, 50)
  accountEmail: string;

  @ApiProperty({
    description: '계정 비밀번호 hash 값',
    example: 'asdf1234',
    required: true,
  })
  @IsString()
  @Length(1, 200)
  password: string;
}
