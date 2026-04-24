import { Controller, Get } from "@nestjs/common";

/**
 * AppController
 *
 * Root-level controller for system-wide operations.
 * Primarily responsible for health monitoring and service availability checks.
 */
@Controller()
export class AppController {
  /**
   * Returns the current API status.
   * Uses a standardized i18n key for the message to support localized monitoring dashboards.
   */
  @Get()
  healthCheck() {
    return {
      status: "ok",
      message: "common.messages.apiRunning",
      timestamp: new Date().toISOString(),
    };
  }
}
