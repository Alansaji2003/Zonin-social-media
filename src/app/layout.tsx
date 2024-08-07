import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/NavBar';
import { ClerkProvider } from '@clerk/nextjs';
import * as hook from '@/hooks/costomRefesh';
import { dark } from '@clerk/themes';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Zon-in',
  description: 'Social media app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  hook.Refresh;
  return (
    <ClerkProvider
    appearance={{
      baseTheme: dark
    }}>
      <html lang="en">
        <body className={inter.className}>
          <div className="w-full px-4 bg-slate-800 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
            <NavBar />
          </div>
          <div className="w-full px-4 bg-black md:px-8 lg:px-16 xl:px-32 2xl:px-64">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
