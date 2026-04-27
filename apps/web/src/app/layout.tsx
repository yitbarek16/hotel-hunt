import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hotel Hunt",
  description: "Bid on hotel rooms in Ethiopia — propose your price, hotels decide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen">
          <nav className="border-b border-stone-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
              <Link href="/" className="text-lg font-semibold text-teal-800">
                Hotel Hunt
              </Link>
              <div className="flex gap-4 text-sm font-medium text-stone-700">
                <Link href="/" className="hover:text-teal-800">
                  Browse rooms
                </Link>
                <Link href="/admin" className="hover:text-teal-800">
                  Admin
                </Link>
              </div>
            </div>
          </nav>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
