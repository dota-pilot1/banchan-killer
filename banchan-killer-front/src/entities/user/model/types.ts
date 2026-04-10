export type UserRole = 'USER' | 'ADMIN';

export interface UserSummary {
  id: number;
  email: string;
  nickname?: string | null;
  role: UserRole;
  enabled: boolean;
  createdAt: string;
}
