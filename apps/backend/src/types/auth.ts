import type { UserRole } from '@saj/types';

export interface AuthUser {
  id: number;
  username: string;
  name: string;
  role: UserRole;
  isActive: boolean;
}
