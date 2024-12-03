import { ApiProperty } from '@nestjs/swagger';

export class AuthStatusDto {
  @ApiProperty()
  isAuthorized: boolean;

  @ApiProperty()
  isProfileCompleted: boolean;
}
