import { Controller, Get, Param } from '@nestjs/common';
import { Group } from 'src/schemas/group.schema';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {

    
  constructor(private readonly  groupService: GroupService) {}

  @Get()
  findAll() {
    return this.groupService.findAllDto();
  }
  @Get('/:socketId')
  findOneBySocketId(@Param('socketId') socketId: string) {
    return this.groupService.findBySocketId(socketId);
  }
}
