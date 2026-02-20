import type { Metadata, Viewport } from "next";
import "./globals.css";

// 1. Metadata: Handles SEO and PWA branding
export const metadata: Metadata = {
  title: "Shift | Lock In",
  description: "Shift is the execution engine for serious builders...",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Shift",
    startupImage: "/images/shift.png", // 
  },
  icons: {
    apple: "/images/shift.png", // This ensures iPhones use your shift.png
  }
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
      <body className="antialiased selection:bg-blue-500/30">
        {children}
      </body>
    </html>
  );
}