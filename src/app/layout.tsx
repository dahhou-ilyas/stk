'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/nav";
import AuthProvider from "@/store/auth-context";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="forest">
      <body className={inter.className +" h-[100vh]"} >
        <AuthProvider>
          <NavBar/>
          <Toaster position="bottom-center" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}