'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/nav";
import AuthProvider from "@/store/auth-context";

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="forest">
      <body className={inter.className +" h-[100vh]"} >
        <NavBar/>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}