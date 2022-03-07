import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { UserService } from './user/user.service';
import { MessagesService } from './messages/messages.service';
import { CreateMessageDto } from './messages/dto/create-message.dto';
import { GroupService } from './group/group.service';
import { FriendListService } from './friend-list/friend-list.service';
@WebSocketGateway(3001, {
  cors: {
    origin: ['http://localhost:4200', '*'],
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['X-Requested-With', 'content-type'],
    credentials: true,
  },
  allowEIO3: true,
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  usersCollection = [];

  constructor(private readonly userService: UserService,
    private readonly messagesService: MessagesService,
    private readonly groupService: GroupService,
    private readonly friendListService: FriendListService,
  ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, message: any) {
    // this.server.emit('msgToClient', payload);
    console.log('Message received:');
    console.log(message);
    let users = await this.userService.findAll();

    const sender = users.find((x) => x.socketId == message.fromId);
    if (sender) {
      const sendTo = users.find((x) => x.socketId == message.toId);
      let messageDto: CreateMessageDto;
      if (sendTo) {
        //is an user
        messageDto = {
          type: message.type,
          fromId: sender._id,
          toId: sendTo._id,
          message: message.message,
          dateSent: message.dateSent,
        }
        await this.messagesService.create(messageDto);
        this.server.to(message.toId).emit('messageReceived', {
          user: { 
            id : sender.socketId,
            displayName: sender.displayName,
            status: sender.status,
            avatar: null,
          },
          message: message,
        });
      } else {
        //is a group
        
        const group = await this.groupService.findBySocketId(message.toId);
        messageDto = {
          type: message.type,
          fromId: sender._id,
          toId: group._id,
          message: message.message,
          dateSent: message.dateSent,
        }

        await this.messagesService.create(messageDto);
        const usersInGroupToNotify = group.users;
        
        usersInGroupToNotify.forEach((user) => {

          if (user.socketId !== sender.socketId) {
            this.server.to(user.socketId).emit('messageReceived', {
              user: { 
                id: group.socketId,
                displayName: group.displayName,
                status: group.status,
                avatar: null,
              },
              message: message,
            });
          }

        });

      }
    }
    console.log('Message dispatched.');
  }

  @SubscribeMessage('join')
  async handleJoin(client: Socket, username: string) {
    console.log('User joined');
    // Same contract as ng-chat.User
    // This is the user's unique ID to be used on ng-chat as the connected user.
    client.emit('generatedUserId', client.id);
    
    const user = await this.userService.findByUsername(username);

    if(user){
      await this.userService.updateSocketId(user._id, client.id);
      await this.userService.updateConnected(user._id, true);
    }else{
      await this.userService.create({
        id: client.id, // Assigning the socket ID as the user ID in this example
        socketId: client.id, // Assigning the socket ID as the user ID in this example
        displayName: username,
        username: username,
        status: 0, // ng-chat UserStatus.Online,
        avatar: null,
        participantType: 0,
        connected: true
      });
    }

      const friendList = await  this.friendListService.findFriendListByUserSocketId(client.id)
  //   participant: {
  //     id: socket.id, // Assigning the socket ID as the user ID in this example
  //     displayName: username,
  //     status: 0, // ng-chat UserStatus.Online,
  //     avatar: null,
  //     participantType: 0
  // }
    this.server.emit('friendsListChanged', friendList);

  }

  @SubscribeMessage('groupCreated')
  async handleGroupCreated(client: Socket, group: any) {
    console.log(group);
    const groupSearch = await this.groupService.findByIdGroup(group.id);
    const socketsIds = group.chattingTo.map(ct => ct.id);
    const usersInGroup = await this.userService.findAllBySocketId(socketsIds);

    const idUsers = usersInGroup.map(u => u._id);

    if(groupSearch){
      // await this.groupService.updateSocketId(group._id, client.id);
    } else {
      await this.groupService.createGroup({
        id: group.id, // Assigning the socket ID as the user ID in this example
        socketId: group.id, // Assigning the socket ID as the user ID in this example
        displayName: group.displayName,
        status: 0, // ng-chat UserStatus.Online,
        users: idUsers
    });
    }

    
    let users = await this.userService.findAllUserConnected();
    let usersCollection = users.map( user => {
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
    const listFriends = [];

    usersInGroup.forEach(async (user) => {
      const groupCollection = await this.groupService.findGroupByUserId(user._id);
      const group = groupCollection.map(group => {

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
      
      this.server.to(user.socketId).emit('friendsListChanged', listFriends.concat(group).concat(usersCollection));
    })
    console.log(group.id + '  was created.');
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    const user = await this.userService.findBySocketId(client.id)
    await this.userService.updateConnected(user._id, false)
    const friendList = await  this.friendListService.findFriendListByUserSocketId(client.id)

    this.server.emit('userDisconnected', friendList, client.id);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
