import type { ReactNode } from 'react';
import './globals.css';
/**
 * Application Metadata
 * Defines the SEO properties for the root route.
 */
export const metadata = {
  title: 'Skeleton LP nest next TailAdmin',
  description: 'Next.js App',
};

/**
 * Root Page Component
 *
 * Architecture Note (Senior):
 * In a standard Next.js App Router structure, the 'html' and 'body' tags 
 * are usually managed by 'layout.tsx'. If this file acts as a landing page,
 * consider moving the shell structure to the root layout and keeping this
 * focused on the UI components and business logic hooks.
 */
export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    // Note: 'lang' attribute should ideally be dynamic based on the [locale] segment
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}