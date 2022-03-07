import { Module } from '@nestjs/common';
import { GroupModule } from 'src/group/group.module';
import { UserModule } from 'src/user/user.module';
import { FriendListService } from './friend-list.service';
import { FriendListController } from './friend-list.controller';

@Module({
  providers: [FriendListService],
  imports: [
    UserModule,
    GroupModule
  ],
  controllers: [FriendListController],
  exports: [FriendListService]
})
export class FriendListModule {}
