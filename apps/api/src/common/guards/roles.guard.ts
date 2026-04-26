import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    /**
     * Coarse-grained authorization check: validates that the
     * user identity contains at least one of the required roles.
     */
    const requiredRoles = this.reflector.get<string[]>(
      "roles",
      context.getHandler(),
    );

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.roles) return false;

    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
