import type { Metadata } from "next";
import "./globals.css";

import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700']
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
        className={spaceGrotesk.className}
      >
        {children}
      </body>
    </html>
  );
}
