import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { Toaster } from "react-hot-toast";

// Dynamically import message files based on the active locale to optimize bundle size.
const messagesMap = {
  en: () => import("../../messages/en.json"),
  es: () => import("../../messages/es.json"),
};

/**
 * Root Locale Layout
 *
 * Architecture Role (Senior):
 * This layout serves as the primary shell for all localized routes. It orchestrates
 * global providers such as `NextIntlClientProvider`, `ThemeProvider`, and `SidebarProvider`,
 * ensuring that internationalization, theming, and UI state are consistently available
 * across the application. It also centralizes the `Toaster` for consistent user feedback.
 * The dynamic import of message files (`messagesMap`) is a key optimization to
 * reduce initial bundle size by loading only the necessary locale messages.
 */
export default async function LocaleLayout({ children, params }) {
  // Extract the locale from the URL parameters.
  const { locale } = await params;

  // Load the appropriate message file for the current locale.
  const loadMessages = messagesMap[locale];

  // If the locale is not supported, render the Next.js 404 page.
  if (!loadMessages) notFound();

  // Await the dynamic import to get the messages object.
  const messages = (await loadMessages()).default;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {/* Provides theme context for UI components */}
          <ThemeProvider>
            {/* Provides sidebar state management */}
            <SidebarProvider>
              {children}

              {/* Global notification system for user feedback */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    borderRadius: "10px",
                    padding: "12px 14px",
                    fontSize: "14px",
                  },
                  success: {
                    style: {
                      background: "#16a34a",
                      color: "white",
                    },
                  },
                  error: {
                    style: {
                      background: "#dc2626",
                      color: "white",
                    },
                  },
                }}
              />
            </SidebarProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}