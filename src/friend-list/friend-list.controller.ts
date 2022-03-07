import { Controller, Get, Query } from '@nestjs/common';
import { FriendListService } from './friend-list.service';

@Controller('friend-list')
export class FriendListController {
    constructor(private readonly friendListService: FriendListService) {}

  @Get()
  findAll(@Query('idUser') idUser:string) {
    return this.friendListService.findFriendListByUserSocketId(idUser);
  }
}
