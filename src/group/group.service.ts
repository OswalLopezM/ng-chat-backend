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
        const group = await this.groupModel
            .findOne({
                socketId: id,
            })
            .populate('users')
            .exec();

        return group;
    }



  async findBySocketIdDto(id: string) {
      const group = await this.groupModel
          .findOne({
              socketId: id,
          })
          .populate('users')
          .exec();

        let chattingTo = group.users.map( user => {
            return {
            id: user.socketId,
            displayName: user.displayName,
            status: user.status,
            avatar: user.avatar,
            participantType: user.participantType,
            chattingTo: []
            }
        })
        return {
            participant: {
                id: group.socketId, // Assigning the socket ID as the group ID in this example
                displayName: group.displayName,
                status: group.status, // ng-chat groupStatus.Online,
                avatar: null,
                participantType: 1,
                chattingTo: chattingTo
            }
        }
              
  }

    async findGroupByUserId(idUser) {
      return this.groupModel.find({
        users: { $in: idUser }
      }).populate('users').exec();
    }

    async findAll() {
      return this.groupModel.find().populate('users').exec();
    }

    async findAllDto() {
      
      const groupCollection = await this.groupModel.find().populate('users').exec();

      const groups = groupCollection.map(group => {
          let chattingTo = group.users.map( user => {
              return {
              id: user.socketId,
              displayName: user.displayName,
              status: user.status,
              avatar: user.avatar,
              participantType: user.participantType,
              chattingTo: []
              }
          })
          return {
              participant: {
                  id: group.socketId, // Assigning the socket ID as the group ID in this example
                  displayName: group.displayName,
                  status: group.status, // ng-chat groupStatus.Online,
                  avatar: null,
                  participantType: 1,
                  chattingTo: chattingTo
              }
          }
      })

      return groups;
    }

    async findByIdMongo(id: string) {
        
    }
}
