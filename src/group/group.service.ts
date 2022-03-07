import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group, GroupDocument } from 'src/schemas/group.schema';
import { CreateGroupDto } from './dto/create-group.dto';
import { Model } from 'mongoose';

@Injectable()
export class GroupService {
    constructor(
      @InjectModel(Group.name) private groupModel: Model<GroupDocument>
    ) {}

    async createGroup(dto: CreateGroupDto) {
        const createdGroup = new this.groupModel(dto);
        return createdGroup.save();
    }

    async findByIdGroup(id: string) {
        return this.groupModel
            .findOne({
                id: id,
            })
            .exec();
    }

    async findBySocketId(id: string) {
        return this.groupModel
            .findOne({
                socketId: id,
            })
            .populate('users')
            .exec();
    }

    async findGroupByUserId(idUser) {
      return this.groupModel.find({
        users: { $in: idUser }
      }).populate('users').exec();
    }

    async findAll() {
      return this.groupModel.find().populate('users').exec();
    }

    async findByIdMongo(id: string) {
        
    }
}
