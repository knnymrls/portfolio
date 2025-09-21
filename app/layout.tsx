import type { Metadata } from "next";
import { Sora, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { NavigationBar } from "@/components/ui/NavigationBar";
import { ChatbotInterface } from "@/components/ui/ChatbotInterface";
import Footer from "@/components/layout/Footer";

const sora = Sora({ subsets: ["latin"] });
const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-plus-jakarta"
});

export const metadata: Metadata = {
  title: "Kenny Morales - Portfolio",
  description: "Designing AI interfaces for the future",
};

const navigationTabs = [
  { label: "Work", href: "/" },
  { label: "Ventures", href: "/ventures" },
  { label: "About", href: "/about" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.className} ${plusJakarta.variable} antialiased`}>
        <NavigationBar tabs={navigationTabs} />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ChatbotInterface />
      </body>
    </html>
  );
}
