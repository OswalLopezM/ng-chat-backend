import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from 'src/schemas/group.schema';
import { GroupService } from './group.service';

@Module({
  providers: [GroupService],
  exports: [GroupService],
  imports: [
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }])
  ],
})
export class GroupModule {}
