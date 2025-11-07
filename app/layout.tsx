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
          <br />
          Attribute info adapted from <a style={{textDecoration:"underline"}} href="https://docs.google.com/spreadsheets/d/1ZY-nG60U7amPfqEcKnP5qkcK2JKrzpTyX8NkpPlYwZU/edit?gid=412886485#gid=412886485">Skyblock Things by Georik</a>
        </footer>
      </body>
    </html>
  );
}
