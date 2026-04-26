import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import cookieParser from "cookie-parser";
import { join } from "path";
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

  // Global filter for i18n-standardized error responses
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  });

  // Enable cookie parsing for secure session management
  app.use(cookieParser());
  app.useStaticAssets(join(process.cwd(), "public"));

  const port = process.env.PORT || 3001;
  await app.listen(port);
}

bootstrap();
