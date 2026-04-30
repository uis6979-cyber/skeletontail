import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSIONS_KEY } from "../decorators/permissions.decorator";

/**
 * PermissionsGuard enforces access control based on granular permissions defined on routes.
 * It checks if the authenticated user possesses all required permissions for the requested operation.
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Retrieve required permissions from route metadata
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) return true; // No specific permissions required for this route

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.permissionsModule) return false; // Deny if no user or permissions are available

    const hasAccess = requiredPermissions.every((perm) =>
      user.permissionsModule.includes(perm),
    );

    return hasAccess;
  }
}
