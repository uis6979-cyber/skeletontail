import toast from "react-hot-toast";

type HandleFormErrorParams = {
  err: any;
  setErrors?: (errors: Record<string, string>) => void;
  tRoot: (key: string) => string;
  tCommon: (key: string) => string;
  showToast?: boolean;
};

/**
 * Centralized utility to process and display form-related errors from the API.
 * Supports normalized validation objects, legacy arrays, and simple string messages.
 */
export function handleFormError({
  err,
  setErrors,
  tRoot,
  tCommon,
  showToast = true,
}: HandleFormErrorParams) {
  const message = err?.message;

  if (err?.type === "validation" && err?.fields) {
    const translatedErrors: Record<string, string> = {};

    for (const [key, value] of Object.entries(err.fields)) {
      translatedErrors[key] =
        typeof value === "string" && value.includes(".")
          ? tRoot(value)
          : String(value);
    }

    setErrors?.(translatedErrors);

    if (showToast) {
      const errorSummary = Object.values(translatedErrors)
        .map((msg) => `• ${msg}`)
        .join("\n");

      toast.error(errorSummary, { duration: 5000 });
    }
    return;
  }

  if (Array.isArray(message)) {
    if (showToast) {
      const errorSummary = message
        .map((e: any) => {
          const msg = e?.message || "";
          return typeof msg === "string" && msg.includes(".")
            ? `• ${tRoot(msg)}`
            : `• ${msg}`;
        })
        .join("\n");

      toast.error(errorSummary, { duration: 5000 });
    }
    return;
  }

  const finalMessage =
    typeof message === "string"
      ? message.includes(".")
        ? tRoot(message)
        : message
      : tCommon("messages.error");

  if (showToast) {
    toast.error(finalMessage);
  }
}