import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
@ApiProperty()
id?: string;

@ApiProperty()
socketId?: string;

@ApiProperty()
displayName?: string;

@ApiProperty()
username?: string;

  @ApiProperty()
  status?: number;

  @ApiProperty()
  avatar?: string;

  @ApiProperty()
  participantType?: number;

  @ApiProperty()
  chattingTo?: any[];

  @ApiProperty()
  connected?: boolean;
  
}
