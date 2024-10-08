import { Karla, Inconsolata } from "next/font/google";

import "./globals.css";

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
});
const inconsolata = Inconsolata({
  subsets: ["latin"],
  variable: "--font-inconsolata",
});

export const metadata = {
  title: "Random Password Generator",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="min-h-full">
      <body className={`${karla.variable} ${inconsolata.variable} min-h-full h-auto font-inconsolata antialiased`}>
        {children}
      </body>
    </html>
  );
}
