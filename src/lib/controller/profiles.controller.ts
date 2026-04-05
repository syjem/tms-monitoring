import { profiles } from '@/lib/supabase/schema';
import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class ProfilesController {
  db: PostgresJsDatabase<Record<string, never>>;
  constructor(db: PostgresJsDatabase<Record<string, never>>) {
    this.db = db;
  }

  async setSignature(user_id: string, data: string) {
    try {
      // update engineer signature if present otherwise add new entry
      const result = await this.db.transaction(async (txs) => {
        const profile = await txs
          .select()
          .from(profiles)
          .where(eq(profiles.user_id, user_id));

        // check if user is existed
        if (profile.length > 0) {
          // apply update
          const updated_signature = await txs
            .update(profiles)
            .set({ signature: data })
            .where(eq(profiles.user_id, user_id))
            .returning({ updated_at: profiles.updated_at, id: profiles.id });

          return updated_signature;
        }

        // add new entry to the database
        const create_result = await txs
          .insert(profiles)
          .values({ user_id: user_id, signature: data })
          .returning({
            created_at: profiles.created_at,
            id: profiles.id,
          });

        return create_result;
      });

      return result[0];
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(
          `[${ProfilesController.name}:${this.setSignature.name}] Error: ` +
            e?.message,
        );
      }
    }
  }

  /**
   * Retrieve engineer record by the provided id
   * @param id - engineer unique id
   * @throws {Error} Throws an error with context if:
   *   - The id is missing or empty
   *   - A database operation fails
   */
  async getEngineerByUserId(user_id: string) {
    try {
      if (!user_id) throw new Error('Missing parameter user_id!');
      const result = await this.db
        .select({
          id: profiles.id,
          default_destination: profiles.default_destination,
          default_remarks: profiles.default_remarks,
          signatories: profiles.signatories,
          created_at: profiles.created_at,
          updated_at: profiles.updated_at,
          signature: profiles.signature,
        })
        .from(profiles)
        .where(eq(profiles.user_id, user_id));

      return result.length > 0 ? result[0] : null;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(
          `[${ProfilesController.name}:${this.getEngineerByUserId.name}] Error: ` +
            e?.message,
        );
      }
    }
  }

  async setSignatories(
    user_id: string,
    signatories: {
      id: number;
      name: string;
      title: string;
      includeSignature: boolean;
    }[],
  ) {
    try {
      const result = await this.db.transaction(async (txs) => {
        const profile = await txs
          .select()
          .from(profiles)
          .where(eq(profiles.user_id, user_id));

        // proceed to update if profile exists
        if (profile.length > 0) {
          const updated = await txs
            .update(profiles)
            .set({ signatories, updated_at: new Date() })
            .where(eq(profiles.user_id, user_id))
            .returning({
              id: profiles.id,
              signatories: profiles.signatories,
              updated_at: profiles.updated_at,
            });
          return updated[0];
        }

        // add new entry to the database
        const created = await txs
          .insert(profiles)
          .values({ user_id: user_id, signatories: signatories })
          .returning({
            id: profiles.id,
            signatories: profiles.signatories,
            updated_at: profiles.updated_at,
          });

        return created[0];
      });

      return result;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(
          `[${ProfilesController.name}:${this.setSignatories.name}] Error: ` +
            e?.message,
        );
      }
    }
  }

  async setAttendanceDefaults(
    user_id: string,
    defaults: {
      destination: string;
      remarks: string;
    },
  ) {
    try {
      const result = await this.db.transaction(async (txs) => {
        const profile = await txs
          .select()
          .from(profiles)
          .where(eq(profiles.user_id, user_id));

        if (profile.length > 0) {
          const updated = await txs
            .update(profiles)
            .set({
              default_destination: defaults.destination,
              default_remarks: defaults.remarks,
              updated_at: new Date(),
            })
            .where(eq(profiles.user_id, user_id))
            .returning({
              id: profiles.id,
              default_destination: profiles.default_destination,
              default_remarks: profiles.default_remarks,
              updated_at: profiles.updated_at,
            });

          return updated[0];
        }

        const created = await txs
          .insert(profiles)
          .values({
            user_id,
            default_destination: defaults.destination,
            default_remarks: defaults.remarks,
          })
          .returning({
            id: profiles.id,
            default_destination: profiles.default_destination,
            default_remarks: profiles.default_remarks,
            updated_at: profiles.updated_at,
          });

        return created[0];
      });

      return result;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(
          `[${ProfilesController.name}:${this.setAttendanceDefaults.name}] Error: ` +
            e?.message,
        );
      }
    }
  }
}
