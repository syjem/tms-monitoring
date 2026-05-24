import { cn } from '@/lib/utils';
import AppProvider from '@/provider';
import type { Metadata } from 'next';
import { DM_Sans, Geist, Geist_Mono, Noto_Serif } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const notoSerifHeading = Noto_Serif({
  subsets: ['latin'],
  variable: '--font-heading',
});

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Employee Monitoring',
  description:
    'Upload your daily logs PDF and automate your monitoring process with an AI-powered solution',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        'h-full',
        'antialiased',
        geistSans.variable,
        geistMono.variable,
        'font-sans',
        dmSans.variable,
        notoSerifHeading.variable,
      )}
    >
      <body>
        <AppProvider>{children}</AppProvider>
        <Toaster position="bottom-center" richColors className="print:hidden" />
      </body>
    </html>
  );
}
