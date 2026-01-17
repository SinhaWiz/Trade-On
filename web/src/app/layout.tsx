import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trade-On | Crypto Trading Simulator",
  description: "A cryptocurrency trading simulation game. Pay back the loan shark in 160 turns!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-trade-dark text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
