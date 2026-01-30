import db from '../database/db';
import { randomBytes } from 'crypto';
import { verifyPassword } from '../utils/password';
import { AuthUser } from '../types/auth';
import { UserService } from './user.service';

const SESSION_TTL_HOURS = 24;

export class AuthService {
  static login(username: string, password: string) {
    const user = UserService.getByUsername(username);
    if (!user || !user.isActive) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
    }

    const valid = verifyPassword(password, user.passwordSalt, user.passwordHash);
    if (!valid) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + SESSION_TTL_HOURS * 60 * 60 * 1000).toISOString();

    db.prepare(`
      INSERT INTO sessions (userId, token, expiresAt, lastUsedAt)
      VALUES (?, ?, ?, ?)
    `).run(user.id, token, expiresAt, new Date().toISOString());

    const authUser: AuthUser = {
      id: user.id!,
      username: user.username,
      name: user.name,
      role: user.role,
      isActive: Boolean(user.isActive),
    };

    return { token, user: authUser };
  }

  static logout(token: string) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
  }

  static getUserByToken(token: string): AuthUser | null {
    const row = db.prepare(`
      SELECT s.id as sessionId, s.expiresAt, u.id, u.username, u.name, u.role, u.isActive
      FROM sessions s
      JOIN users u ON s.userId = u.id
      WHERE s.token = ?
    `).get(token) as any;

    if (!row || !row.isActive) return null;
    if (new Date(row.expiresAt).getTime() < Date.now()) {
      db.prepare('DELETE FROM sessions WHERE id = ?').run(row.sessionId);
      return null;
    }

    db.prepare('UPDATE sessions SET lastUsedAt = ? WHERE id = ?').run(new Date().toISOString(), row.sessionId);

    return {
      id: row.id,
      username: row.username,
      name: row.name,
      role: row.role,
      isActive: Boolean(row.isActive),
    };
  }
}
