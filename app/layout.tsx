import type { Metadata } from "next";
import "./globals.css";
import { Archivo_Black, Space_Grotesk } from "next/font/google";
 
const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-head",
  display: "swap",
});
 
const space = Space_Grotesk({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Attribute Lookup",
  description: "Hypixel Skyblcok Attribute Lookup",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${archivoBlack.variable} ${space.variable}`}>
        {children}
        <footer>
          UI Components from <a style={{textDecoration:"underline"}} href="https://www.retroui.dev/">RetroUI</a>
        </footer>
      </body>
    </html>
  );
}
