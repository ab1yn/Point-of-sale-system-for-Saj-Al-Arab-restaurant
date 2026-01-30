import db from '../database/db';

export class AuditService {
  static log(data: { userId?: number; action: string; entity?: string; entityId?: number; metadata?: any }) {
    const metadata = data.metadata ? JSON.stringify(data.metadata) : null;
    db.prepare(`
      INSERT INTO audit_logs (userId, action, entity, entityId, metadata)
      VALUES (?, ?, ?, ?, ?)
    `).run(data.userId || null, data.action, data.entity || null, data.entityId || null, metadata);
  }
}
