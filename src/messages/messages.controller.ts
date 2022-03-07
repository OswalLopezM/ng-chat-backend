import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
@ApiTags('Message')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}

  @Get()
  findAll() {
    return this.messageService.findAll();
  }

  @Get('/history')
  findHistory(@Query('userId') userId:string, @Query('destinataryId') destinataryId: string) {
    return this.messageService.findHistory(userId, destinataryId);
  }

  @Post()
  create(@Body() dto: CreateMessageDto) {
    return this.messageService.create(dto);
  }

  
}
