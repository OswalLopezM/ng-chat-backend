import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from 'src/schemas/message.schema';
import { UserModule } from 'src/user/user.module';
import { GroupModule } from 'src/group/group.module';

@Module({
  providers: [MessagesService],
  controllers: [MessagesController],
  exports: [MessagesService],
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    UserModule,
    GroupModule
  ],
})
export class MessagesModule {}
