import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Void Hunter',
  description: 'A futuristic 2D survival shooter experience built with Next.js and Canvas.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
