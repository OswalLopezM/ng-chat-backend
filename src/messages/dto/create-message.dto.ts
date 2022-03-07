export class CreateMessageDto {
    type: number;
    fromId: string;
    toId: string;
    message: string;
    dateSent: string;
}