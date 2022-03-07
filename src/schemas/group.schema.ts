import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema';

export type GroupDocument = Group & Document;

@Schema()
export class Group {

  @Prop({ type: String })
  id: string; //Id PDM

  @Prop({ type: String })
  socketId: string;

  @Prop({ type: String })
  displayName: string;

  @Prop({ type: Number })
  status: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  users: User[];

}

export const GroupSchema = SchemaFactory.createForClass(Group);
