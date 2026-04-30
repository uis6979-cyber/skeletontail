import { BadRequestException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

/**
 * Maps specific Prisma client errors to standardized API `BadRequestException`s.
 * This utility helps in returning consistent, localized error messages to the frontend.
 */
export function handlePrismaError(
  error: any,
  namespace: string = "common.messages.validations",
) {
  // Handles unique constraint violations (P2002) by mapping to i18n keys.
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    const fields = (error.meta?.target ?? []) as string[];

    throw new BadRequestException(
      fields.map((field) => ({
        field,
        message: `${namespace}.${field}AlreadyExists`,
      })),
    );
  }

  throw error;
}
