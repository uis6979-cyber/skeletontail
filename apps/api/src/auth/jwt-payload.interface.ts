export interface JwtPayload {
  sub: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  roles: string[];
  permissions: string[];
}
