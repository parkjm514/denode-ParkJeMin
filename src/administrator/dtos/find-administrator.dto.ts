import { ApiProperty } from '@nestjs/swagger';

export class FindAdministratorDto {
  @ApiProperty({
    description: '계정 pk값',
    required: false,
  })
  accountId?: number;

  @ApiProperty({
    description: '계정 email',
    required: false,
  })
  accountEmail?: string;

  @ApiProperty({
    description: '계정 join 여부',
    required: false,
  })
  accountJoin?: boolean;

  passwordLoadable?: boolean;
}
