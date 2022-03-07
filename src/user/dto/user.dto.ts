export class UserDto {
    participant: {
        id: string;
        displayName: string;
        lastName: string;
        status: string;
        avatar: string;
        participantType: string;
        chattingTo: string;
    }
}