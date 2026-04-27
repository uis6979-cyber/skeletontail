/**
 * Normalizes API error responses for consistent handling across the application.
 * Supports structured validation arrays and simple error strings.
 */
export async function handleApiError(res: Response) {
  try {
    const error = await res.json();

    // Handle structured validation errors (typically array of field constraints)
    if (Array.isArray(error?.message)) {
      throw {
        type: "validation",
        message: error.message,
      };
    }

    // Handle standard single-message errors or provide localized fallback
    throw {
      type: "simple",
      message: error?.message || "common.messages.error",
    };
  } catch (e: any) {
    // If the error was already structured in the try block, re-throw it
    if (e?.message) throw e;

    // Default fallback for unexpected response formats or network issues
    throw {
      type: "simple",
      message: "common.messages.error",
    };
  }
}