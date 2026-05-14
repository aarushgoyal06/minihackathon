import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Roast Generator 🔥",
  description:
    "Get funny, personalized, and safe roasts based on your profile. Choose your intensity level and let AI do the rest.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

