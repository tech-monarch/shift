import type { Metadata, Viewport } from "next";
import "./globals.css";

// 1. Metadata: Handles SEO and PWA branding
export const metadata: Metadata = {
  title: "Shift | Lock In",
  description:
    "Shift is the execution engine for serious builders. Execute daily tasks and let AI turn your work into social media content.",
  manifest: "/manifest.json",
  metadataBase: new URL("https://shift.app"),
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Shift",
    startupImage: "/images/shift.png",
  },
  icons: {
    icon: [
      { url: "/images/shift.png", sizes: "any" },
      { url: "/images/shift.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/images/shift.png",
    shortcut: "/images/shift.png",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Shift",
  },
};

// 2. Viewport: Handles the visual window settings (Theme color, scaling)
export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents accidental zooming on mobile inputs
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#050505" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Shift" />
        <meta
          name="description"
          content="Shift is the execution engine for serious builders."
        />
        <link rel="apple-touch-icon" href="/images/shift.png" />
        <link rel="icon" type="image/png" href="/images/shift.png" />
      </head>
      <body className="antialiased selection:bg-blue-500/30">{children}</body>
    </html>
  );
}
