
export type ValidationError = {
  field: string;
  message: string;
};

export type NormalizedValidationError = {
  type: "validation";
  fields: Record<string, string>;
};

export type NormalizedSimpleError = {
  type: "simple";
  message: string;
};

export type NormalizedError = NormalizedValidationError | NormalizedSimpleError;

/**
 * Normalizes API error responses for consistent handling across the application.
 * Transforms validation arrays or single error messages into a standardized object structure.
 */
export async function handleApiError(res: Response): Promise<never> {
  let error: any;
  try {
    error = await res.json();
  } catch {
    throw {
      type: "simple",
      message: "common.messages.error",
    } as NormalizedSimpleError;
  }
  if (Array.isArray(error?.message)) {
    const fields = (error.message as ValidationError[]).reduce(
      (acc, e) => {
        if (e.field && e.message) {
          acc[e.field] = e.message;
        }
        return acc;
      },
      {} as Record<string, string>
    );
    throw {
      type: "validation",
      fields,
    };
  }

  throw {
    type: "simple",
    message: error?.message || "common.messages.error",
  } as NormalizedSimpleError;
}