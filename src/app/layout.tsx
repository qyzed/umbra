import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "UMBRA — анонимные сообщения в Telegram",
  description:
    "Получайте честные анонимные сообщения в Telegram. Одна ссылка — и ваши знакомые смогут сказать то, на что не решаются вслух. Проект создан Rin.",
  openGraph: {
    title: "UMBRA — анонимные сообщения",
    description:
      "Одна ссылка — и ваши знакомые смогут сказать вам правду анонимно. Проект создан Rin.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-ink font-sans text-mist antialiased noise">
        {/* React 19 поднимает эти preload-ссылки в <head> */}
        <link rel="preload" href="/fonts/onest-400-cyrillic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/onest-400-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/unbounded-600-cyrillic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/unbounded-700-cyrillic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {children}
      </body>
    </html>
  );
}
