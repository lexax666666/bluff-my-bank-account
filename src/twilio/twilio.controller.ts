import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { SessionsService } from '../sessions/sessions.service';
import { TwilioSignatureGuard } from './guards/twilio-signature.guard';

@Controller('twilio')
export class TwilioController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post('incoming-call')
  @UseGuards(TwilioSignatureGuard)
  async handleIncomingCall(
    @Body() body: Record<string, any>,
    @Headers() headers: Record<string, any>,
    @Res() res: Response,
  ) {
    const To = body.To as string;

    const session =
      await this.sessionsService.getActiveSessionByPhoneNumber(To);

    if (!session) {
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Sorry, this number is not currently active.</Say>
  <Hangup/>
</Response>`;

      res.status(HttpStatus.OK).type('text/xml').send(twiml);
      return;
    }

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>${session.greetingUrl}</Play>
  <Hangup/>
</Response>`;

    res.status(HttpStatus.OK).type('text/xml').send(twiml);
  }
}
