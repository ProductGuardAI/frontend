import type { Metadata } from "next";
import { LanguageProvider } from "@/components/i18n";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProductGuard AI - Hệ thống Thẩm định & Giám sát Tuân thủ",
  description: "ProductGuard AI helps find, explain, and route product compliance risks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
