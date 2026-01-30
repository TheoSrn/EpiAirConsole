import '@/app/ui/global.css';
import NavBar from "./ui/navbar";

export const metadata = {
  title: 'EpiAirConsole',
  description: 'An Epitech Project',
};

import { ReactNode } from 'react';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <header><NavBar/></header>
        {children}
      </body>
    </html>
  );
}