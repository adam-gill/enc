import type { Metadata } from "next";
import "./globals.css";

import { Space_Grotesk } from "next/font/google"
import { cn } from "@/lib/utils";

const space = Space_Grotesk({
  weight: ["300", "400", "500", "600", "700"],
  style: "normal",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "enc",
  description: "client-side encryption & decryption",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn("antialiased ", space.className)}
      >
        {children}
      </body>
    </html>
  );
}
