import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {

  @Prop({ type: String })
  id: string;

  @Prop({ type: String })
  socketId: string;

  @Prop({ type: String })
  displayName: string;

  @Prop({ type: String, unique: true })
  username: string;

  @Prop({ type: String })
  lastName: string;

  @Prop({ type: Number })
  status: number;

  @Prop({ type: String })
  avatar: string;

  @Prop({ type: String })
  participantType: number;

  @Prop({ type: Boolean })
  connected: boolean;
  

  @Prop([
    {
      id: { type: String },
      displayName: { type: String },
      lastName: { type: String },
      status: { type: String },
      avatar: { type: String },
      participantType: { type: String },
    },
  ])
  chattingTo: Record<string, any>;

  // @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
  // chattingTo: User[];



}

export const UserSchema = SchemaFactory.createForClass(User);
