import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesModule } from './messages/messages.module';
import { MessagesController } from './messages/messages.controller';
import { MessagesService } from './messages/messages.service';
import { UserModule } from './user/user.module';
import { GroupModule } from './group/group.module';
import { FriendListModule } from './friend-list/friend-list.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/ecom-chat'),
    MessagesModule,
    UserModule,
    GroupModule,
    FriendListModule,
  ],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
