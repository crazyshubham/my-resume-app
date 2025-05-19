import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import AppHeader from '@/components/layout/header';

export const metadata: Metadata = {
  title: 'SkillScraper - AI Resume Parser',
  description: 'Upload your resume and extract key skills instantly with SkillScraper, an AI-powered resume parsing tool.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased bg-background text-foreground`}>
        <AppHeader />
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
