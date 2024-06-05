import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer/footer";
import { getCookie } from "cookies-next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Compases Críticos",
  description: "Blog de música",
};

// get theme cookie and set theme
const themeCookie = getCookie("theme");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="mx-auto max-w-10xl text-2xl mb-10">
          <Navbar />
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
