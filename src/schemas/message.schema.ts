import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop()
  type: number;

  @Prop()
  fromId: string;

  @Prop()
  toId: string;

  @Prop()
  message: string;

  @Prop()
  dateSent: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
// Message received from user:
// {
//   type: 1,
//   fromId: '7KfB-qaG0HYeQRN2AAAD',
//   toId: 'BqfuOAvcN6sF98qjAAAE',
//   message: 'asda',
//   dateSent: '2022-03-04T02:05:11.258Z'
// }
// Message received from group:
// {
//     type: 1,
//     fromId: '7KfB-qaG0HYeQRN2AAAD',
//     toId: '23c0922d-831d-4abf-b497-8adcbbd4d293',
//     message: 'dsadasd',
//     dateSent: '2022-03-04T02:05:57.221Z'
// }
