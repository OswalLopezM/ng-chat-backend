import { Injectable } from '@nestjs/common';
import { GroupService } from 'src/group/group.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FriendListService {


  constructor(
    private userService: UserService,
    private groupService: GroupService,
  ) {}

    async findFriendListByUserSocketId(scoketId){
        
        let users= []
        let groups = []
        let listFriends = [];

        let usersCollection = await this.userService.findAllUserConnected();
        users = usersCollection.map( user => {
            return {
                participant: {
                id: user.socketId, // Assigning the socket ID as the user ID in this example
                displayName: user.displayName,
                status: user.status, // ng-chat UserStatus.Online,
                avatar: user.avatar,
                participantType: user.participantType,
                chattingTo: user.chattingTo
                }
            }
        })

        // this.server.emit('friendsListChanged', usersCollection);
        const user = await this.userService.findBySocketId(scoketId);
        if(user){
            // const groupCollection = await this.groupService.findGroupByUserId(user._id);
            const groupCollection = await this.groupService.findAll();
    
        
            groups = groupCollection.map(group => {
    
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
        }
        
        listFriends= listFriends.concat(users).concat(groups)
        return listFriends
    }
}
