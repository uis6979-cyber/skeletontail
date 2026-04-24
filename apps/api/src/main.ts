import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

/**
 * Application Bootstrap
 *
 * Architecture:
 * - Infrastructure: Configures CORS, global filters, and security middleware.
 * - Validation: Enforces strict DTO contracts via global pipes.
 */
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Standardize error payloads across the application
  app.useGlobalFilters(new HttpExceptionFilter());

  // Enable CORS for frontend integration
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  });

  // Enable cookie parsing for secure session management
  app.use(cookieParser());

  // Enforce data integrity through DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips non-decorated properties
      transform: true, // Automatically transforms payloads to DTO instances
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);
}

bootstrap();
