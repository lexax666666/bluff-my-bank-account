import {
  Controller,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createSession(@Body() createSessionDto: CreateSessionDto) {
    const { userId, greetingUrl, expiresInMinutes } = createSessionDto;

    const result = await this.sessionsService.createSession(
      userId,
      greetingUrl,
      expiresInMinutes,
    );

    return {
      success: true,
      data: {
        sessionId: result.sessionId,
        phoneNumber: result.phoneNumber,
        expiresAt: result.expiresAt.toISOString(),
      },
    };
  }

  @Post(':id/expire')
  @HttpCode(HttpStatus.OK)
  async expireSession(@Param('id') id: string) {
    await this.sessionsService.expireSession(id);

    return {
      success: true,
      message: 'Session expired successfully',
    };
  }
}
