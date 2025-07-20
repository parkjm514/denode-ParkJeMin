import { ApiProperty, PickType } from "@nestjs/swagger";
import { Administrator } from "../entities/administrator.entity";
import { IsString, Length } from "class-validator";
import { Account } from "src/account/entities/account.entity";

export class GenerateAdministratorDto extends PickType(Administrator, [
  "administratorName",
  "phone",
]) {
  @ApiProperty({
    description: "계정 이메일",
    example: "test1234@gmail.com",
    required: true,
  })
  @IsString()
  @Length(5, 50)
  email: string;

  @ApiProperty({
    description: "계정 비밀번호 값",
    example: "asdf1234",
    required: true,
  })
  @IsString()
  @Length(5, 50)
  password: string;

  hashedPassword?: string;

  account?: Account;
}
