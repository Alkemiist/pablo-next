
import './globals.css'; // Optional: global styles
import Navbar from './components/global/navbar/navbar';
import { ReactNode } from 'react';
import { ContextProvider } from './context/appContext';
import { Toaster } from 'react-hot-toast';
import { InspoProvider } from './context/inspoContext';

export const metadata = {
  title: 'My App',
  description: 'Welcome to my Next.js app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ContextProvider>
          <InspoProvider>
            <Toaster />
            <Navbar />
            <main className="ml-16 bg-slate-950 h-screen"> 
              {children}
            </main>
          </InspoProvider>
        </ContextProvider>
      </body>
    </html>
  );
}