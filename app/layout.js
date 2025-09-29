import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SWRProvider from "@/contexts/swr-context";
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
  metadataBase: new URL("https://simplegestion.net"),
  title: {
    default: "Simple Gestión - Personal Finance System",
    template: "%s | Simple Gestión",
  },
  description:
    "Simple Gestión is your simple and efficient personal finance system. Manage your income, expenses and get intelligent financial advice with AI. Control your money easily and securely.",
  keywords: [
    "personal finance",
    "money management",
    "expense control",
    "personal budget",
    "savings",
    "investment",
    "finance",
    "household economy",
    "financial management",
    "financial advice",
  ],
  authors: [{ name: "Gabriel Sanchez" }],
  creator: "Gabriel Sanchez",
  publisher: "Gabriel Sanchez",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://simplegestion.net",
    siteName: "Simple Gestión",
    title: "Simple Gestión - Personal Finance System",
    description:
      "Manage your finances simply and efficiently. Control income, expenses and get intelligent financial advice.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Simple Gestión",
    description:
      "Simple and efficient personal finance system to manage income, expenses and get intelligent financial advice",
    url: "https://simplegestion.net",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Organization",
      name: "Simple Gestión Team",
    },
    inLanguage: "en",
    isAccessibleForFree: true,
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    softwareVersion: "1.0",
    datePublished: "2025-09-25",
    dateModified: "2025-09-25",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SWRProvider>
          <UserProvider>{children} </UserProvider>
        </SWRProvider>
      </body>
    </html>
  );
}
