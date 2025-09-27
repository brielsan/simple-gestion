import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SWRProvider from "@/components/providers/swr-provider";
import { ParametersProvider } from "@/contexts/parameters-context";
import { UserProvider } from "@/contexts/user-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Simple Gestión",
  description: "Sistema de finanzas simple y eficiente",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SWRProvider>
          <ParametersProvider>
            <UserProvider>{children} </UserProvider>
          </ParametersProvider>
        </SWRProvider>
      </body>
    </html>
  );
}
