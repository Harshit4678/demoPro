// src/app/layout.jsx
import Footer from "@/components/Footer";
import "./globals.css";
import Header from "@/components/Header";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-manrope",
});

export const metadata = {
  title: "Care India Welfare Trust",
  description: "Empowering women & children across India",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} font-sans min-h-screen antialiased bg-white text-slate-800`}
        suppressHydrationWarning
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
