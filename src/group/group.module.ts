import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from 'src/schemas/group.schema';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';

@Module({
  providers: [GroupService],
  exports: [GroupService],
  imports: [
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }])
  ],
  controllers: [GroupController],
})
export class GroupModule {}
