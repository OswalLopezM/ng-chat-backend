import { UserDto } from "src/user/dto/user.dto";

export class CreateGroupDto {
  id: string; //id pdm
  socketId: string;
  displayName: string;
  status: number;
  users: string[];
  
}
