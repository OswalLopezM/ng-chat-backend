import { Injectable } from '@nestjs/common';
import { User, UserDocument } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createMessageDto: CreateUserDto): Promise<User> {
    const createdMessage = new this.userModel(createMessageDto);
    return createdMessage.save();
  }

  async updateSocketId(id: string, socketId: string): Promise<User> {
    return this.userModel.findByIdAndUpdate({_id: id},{socketId: socketId});
  }

  async updateConnected(id: string, connected: boolean): Promise<User> {
    return this.userModel.findByIdAndUpdate({_id: id},{connected: connected});
  }

  async findAll(): Promise<any[]> {
    return this.userModel.find().exec();
  }

  async findAllUserConnected(): Promise<any[]> {
    return this.userModel.find({
      connected: true
    }).exec();
  }

  async findByUsername(username: string) {
    return this.userModel
      .findOne({
        username: username,
      })
      .exec();
  }

  async findByGroup(group: string) {
    return this.userModel
      .findOne({
        username: group,
        participantType: 1
      })
      .exec();
  }

  async findGroupById(id: string){

  }

  async findBySocketId(id: string){
    return this.userModel.findOne({
      socketId: id,
    });
  }

  async findAllBySocketId(ids: string[]){
    return this.userModel.find({
      socketId: { $in: ids }
    }, '_id socketId');
  }

  async deleteBySocketId(id) {
    const test = await this.userModel.findOneAndDelete({
      'participant.id': id,
    });
    return this.userModel.findOneAndDelete({
      'participant.id': id,
    });
  }
}
