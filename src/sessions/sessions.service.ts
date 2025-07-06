import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { eq, and, or, lt, isNull, sql } from 'drizzle-orm';
import { DRIZZLE_CLIENT } from '../drizzle/drizzle.constants';
import { DrizzleClient } from '../db/database';
import { phoneNumbers, userSessions, UserSession } from '../db/schema';

@Injectable()
export class SessionsService {
  constructor(@Inject(DRIZZLE_CLIENT) private readonly db: DrizzleClient) {}

  async createSession(
    userId: string,
    greetingUrl: string,
    expiresInMinutes: number = 30,
  ): Promise<{
    sessionId: string;
    phoneNumber: string;
    expiresAt: Date;
  }> {
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    return await this.db.transaction(async (tx) => {
      const availablePhones = await tx
        .select()
        .from(phoneNumbers)
        .where(
          or(
            isNull(phoneNumbers.expiresAt),
            lt(phoneNumbers.expiresAt, new Date()),
          ),
        )
        .limit(1)
        .for('update', { skipLocked: true });

      if (availablePhones.length === 0) {
        throw new BadRequestException('No available phone numbers');
      }

      const selectedPhone = availablePhones[0];

      await tx
        .update(phoneNumbers)
        .set({ expiresAt })
        .where(eq(phoneNumbers.id, selectedPhone.id));

      const [newSession] = await tx
        .insert(userSessions)
        .values({
          userId,
          phoneNumberId: selectedPhone.id,
          greetingUrl,
          expiresAt,
        })
        .returning();

      return {
        sessionId: newSession.id,
        phoneNumber: selectedPhone.number,
        expiresAt: newSession.expiresAt,
      };
    });
  }

  async getActiveSessionByPhoneNumber(
    phoneNumber: string,
  ): Promise<UserSession | null> {
    const now = new Date();

    const result = await this.db
      .select({
        session: userSessions,
      })
      .from(userSessions)
      .innerJoin(phoneNumbers, eq(userSessions.phoneNumberId, phoneNumbers.id))
      .where(
        and(
          eq(phoneNumbers.number, phoneNumber),
          lt(sql`${now}`, userSessions.expiresAt),
        ),
      )
      .limit(1);

    return result.length > 0 ? result[0].session : null;
  }

  async expireSession(sessionId: string): Promise<void> {
    const now = new Date();

    await this.db.transaction(async (tx) => {
      const [session] = await tx
        .select()
        .from(userSessions)
        .where(eq(userSessions.id, sessionId))
        .limit(1);

      if (!session) {
        throw new NotFoundException('Session not found');
      }

      await tx
        .update(userSessions)
        .set({ expiresAt: now })
        .where(eq(userSessions.id, sessionId));

      await tx
        .update(phoneNumbers)
        .set({ expiresAt: now })
        .where(eq(phoneNumbers.id, session.phoneNumberId));
    });
  }
}
