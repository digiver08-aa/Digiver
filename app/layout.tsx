import type { Metadata, Viewport } from "next";

import "./globals.css";

import { AppProvider } from "@/providers/AppProvider";
import { siteConfig } from "@/config/site.config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: siteConfig.name,
    template: `%s • ${siteConfig.name}`,
  },

  description: siteConfig.description,

  keywords: siteConfig.keywords,

  creator: siteConfig.creator,

  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,

    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#050816",
  colorScheme: "dark",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}