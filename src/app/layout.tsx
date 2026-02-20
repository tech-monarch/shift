import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shift",
  description:
    "Shift is the execution engine for serious builders. Lock in one non‑negotiable task each day, build an unstoppable streak, and let AI instantly turn your work into posts, articles, and video scripts. Your consistency becomes your content.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Shift",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
