import type { Metadata } from "next";
// Removed all external font imports (Geist and Inter)


// No font definition needed here, relying on system fonts defined by Tailwind

export const metadata: Metadata = {
  // Use professional app name
  title: "Zentlify | The Modern Product Curation Store", 
  description: "A fast, modern e-commerce platform built with Next.js App Router and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // Apply global styling and use the system's default font
        // Tailwind's 'font-sans' typically defaults to system fonts (e.g., Arial, Helvetica)
        className={`antialiased font-sans bg-gray-50 text-gray-800`}
      >
        {children}
      </body>
    </html>
  );
}