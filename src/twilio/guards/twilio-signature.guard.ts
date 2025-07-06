import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';
import { Request } from 'express';

@Injectable()
export class TwilioSignatureGuard implements CanActivate {
  private twilioAuthToken: string;

  constructor(private configService: ConfigService) {
    this.twilioAuthToken =
      this.configService.get<string>('TWILIO_AUTH_TOKEN') || '';
  }

  canActivate(context: ExecutionContext): boolean {
    if (this.configService.get<string>('NODE_ENV') === 'development') {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const signature = request.headers['x-twilio-signature'] as string;

    if (!signature) {
      throw new UnauthorizedException('Missing Twilio signature');
    }

    const url = `${request.protocol}://${request.get('host')}${request.originalUrl}`;
    const params = request.body as Record<string, any>;

    const isValid = twilio.validateRequest(
      this.twilioAuthToken,
      signature,
      url,
      params,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid Twilio signature');
    }

    return true;
  }
}
