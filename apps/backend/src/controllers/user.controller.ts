import { Request, Response } from 'express';
import { z } from 'zod';
import { UserRole } from '@saj/types';
import { UserService } from '../services/user.service';
import { AuditService } from '../services/audit.service';

const createUserSchema = z.object({
  username: z.string().min(3),
  name: z.string().min(1),
  role: UserRole,
  password: z.string().min(6),
});

export class UserController {
  static getAll(req: Request, res: Response) {
    const users = UserService.getAll();
    res.json({ success: true, data: users });
  }

  static create(req: Request, res: Response) {
    const payload = createUserSchema.parse(req.body);
    const id = UserService.create(payload);
    AuditService.log({ userId: req.user?.id, action: 'user.create', entity: 'user', entityId: id });
    res.status(201).json({ success: true, data: { id } });
  }
}
