import QueryProvider from "@/providers/QueryProvider";
import "@mui/material/styles";
import "./globals.css";
/**
 * Global Root Layout
 *
 * Architecture (Senior):
 * - App Shell: Acts as the primary wrapper for the entire application.
 * - Global Styles: Injects baseline CSS (Tailwind/globals) into the component tree.
 * - SSR Synchronization: Uses `suppressHydrationWarning` to ensure smooth attribute 
 *   transitions (common when using theme providers or browser extensions).
 */
export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}