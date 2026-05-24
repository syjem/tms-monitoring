import { db } from '@/db';
import { profiles, Signatory } from '@/db/schema/profile';
import { eq } from 'drizzle-orm';

type DB = typeof db;

export class ProfilesController {
  db: DB;
  constructor(db: DB) {
    this.db = db;
  }

  async getProfile(userId: string) {
    try {
      const profile = await this.db
        .select()
        .from(profiles)
        .where(eq(profiles.userId, userId))
        .limit(1);

      return profile.length > 0 ? profile[0] : null;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`[getProfile] Error: ${e.message}`);
      }
    }
  }

  async getSignature(userId: string) {
    try {
      const signature = await this.db
        .select({
          signature: profiles.signature,
        })
        .from(profiles)
        .where(eq(profiles.userId, userId));

      return signature.length > 0 ? signature[0] : null;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`[getSignature] Error: ${e.message}`);
      }
    }
  }

  async setSignature(userId: string, data: string) {
    try {
      const result = await this.db
        .insert(profiles)
        .values({ userId, signature: data })
        .onConflictDoUpdate({
          target: profiles.userId,
          set: { signature: data },
        })
        .returning({
          id: profiles.id,
          updatedAt: profiles.updatedAt,
          createdAt: profiles.createdAt,
        });

      return result[0];
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`[setSignature] Error: ${e.message}`);
      }
    }
  }

  async getSignatories(userId: string) {
    try {
      const signatories = await this.db
        .select({
          signatories: profiles.signatories,
        })
        .from(profiles)
        .where(eq(profiles.userId, userId));

      return signatories.length > 0 ? signatories[0] : null;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`[getSignatories] Error: ${e.message}`);
      }
    }
  }

  async setSignatories(userId: string, signatories: Signatory[]) {
    try {
      const result = await this.db
        .insert(profiles)
        .values({ userId, signatories })
        .onConflictDoUpdate({
          target: profiles.userId,
          set: { signatories },
        })
        .returning({
          id: profiles.id,
          signatories: profiles.signatories,
          updatedAt: profiles.updatedAt,
        });

      return result[0];
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`[setSignatories] Error: ${e.message}`);
      }
    }
  }
}
