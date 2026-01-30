import db from '../database/db';
import type { User, UserRole } from '@saj/types';
import { hashPassword } from '../utils/password';

export class UserService {
  static getAll(): User[] {
    return db
      .prepare('SELECT id, username, name, role, isActive, createdAt FROM users ORDER BY createdAt DESC')
      .all() as User[];
  }

  static getByUsername(username: string): (User & { passwordHash: string; passwordSalt: string }) | undefined {
    return db
      .prepare('SELECT * FROM users WHERE username = ?')
      .get(username) as (User & { passwordHash: string; passwordSalt: string }) | undefined;
  }

  static getById(id: number): (User & { passwordHash: string; passwordSalt: string }) | undefined {
    return db
      .prepare('SELECT * FROM users WHERE id = ?')
      .get(id) as (User & { passwordHash: string; passwordSalt: string }) | undefined;
  }

  static create(data: { username: string; name: string; role: UserRole; password: string }): number {
    const { hash, salt } = hashPassword(data.password);
    const info = db.prepare(`
      INSERT INTO users (username, name, role, passwordHash, passwordSalt, isActive)
      VALUES (?, ?, ?, ?, ?, 1)
    `).run(data.username, data.name, data.role, hash, salt);
    return info.lastInsertRowid as number;
  }
}
