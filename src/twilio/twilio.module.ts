import { Module } from '@nestjs/common';
import { TwilioController } from './twilio.controller';
import { SessionsModule } from '../sessions/sessions.module';
import { TwilioSignatureGuard } from './guards/twilio-signature.guard';

@Module({
  imports: [SessionsModule],
  controllers: [TwilioController],
  providers: [TwilioSignatureGuard],
})
export class TwilioModule {}
