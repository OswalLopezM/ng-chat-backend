import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from '../schemas/message.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { Model } from 'mongoose';
import { MessageResponseDto } from './dto/message-response.dto';
import { UserDocument } from 'src/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { GroupService } from 'src/group/group.service';
@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private userService: UserService,
    private groupService: GroupService,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const createdMessage = new this.messageModel(createMessageDto);
    return createdMessage.save();
  }

  async findAll(): Promise<Message[]> {
    return this.messageModel.find().exec();
  }

  async findHistory(userId: string, destinataryId: string): Promise<MessageResponseDto[]> {
    // busco usuarios para obtener sus ids de mongo
    const user = await this.userService.findBySocketId(userId);
    let destinatary: any = await this.userService.findBySocketId(destinataryId);
    if(destinatary){
      //es un usuario
      // busco mensajes con los id de usuarios
      console.log(user._id.toString())
      console.log(destinatary._id.toString())
      const messages = await this.messageModel.find({ 
        $or:[ 
          {$and : [{ fromId: user._id.toString() },{ toId: destinatary._id.toString() }]}, 
          {$and : [{ fromId: destinatary._id.toString() },{ toId: user._id.toString() }]}, 
        ]
      }).exec();
      // convierto los id de mongo en los mensajes a los sockets id

      return messages.map((message) => {
        return {
          type: message.type,
          fromId: message.fromId === user._id.toString() ? user.socketId: destinatary.socketId,
          toId: message.toId === user._id.toString() ? user.socketId: destinatary.socketId,
          message: message.message,
          dateSent: message.dateSent
        }
      });
    }
    if(!destinatary) {
      // es un grupo
      destinatary = await this.groupService.findBySocketId(destinataryId);

      if (!destinatary || !user ){
        return []
      }
      const messages = await this.messageModel.find({ 
        toId: destinatary._id.toString()  
      }).exec();
      // convierto los id de mongo en los mensajes a los sockets id
      const usersInGroupIds = messages.map(m=> m.fromId);
      const usersInGroup = await this.userService.findAllById(usersInGroupIds);

      return messages.map((message) => {
        return {
          type: message.type,
          fromId: usersInGroup.find((user) => user._id.toString() === message.fromId.toString()).socketId,
          toId: destinatary.socketId,
          message: message.message,
          dateSent: message.dateSent
        }
      });
    }

    // if(!user || !destinatary){
    //   return []
    // }
    
  }
}
