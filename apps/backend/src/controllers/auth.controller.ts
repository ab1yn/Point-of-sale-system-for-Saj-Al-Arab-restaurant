import { Request, Response } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/auth.service';
import { AuditService } from '../services/audit.service';

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export class AuthController {
  static login(req: Request, res: Response) {
    const { username, password } = loginSchema.parse(req.body);
    const result = AuthService.login(username, password);
    AuditService.log({ userId: result.user.id, action: 'auth.login' });
    res.json({ success: true, data: result });
  }

  static me(req: Request, res: Response) {
    res.json({ success: true, data: req.user });
  }

  static logout(req: Request, res: Response) {
    if (req.token) {
      AuthService.logout(req.token);
    }
    if (req.user) {
      AuditService.log({ userId: req.user.id, action: 'auth.logout' });
    }
    res.json({ success: true });
  }
}
