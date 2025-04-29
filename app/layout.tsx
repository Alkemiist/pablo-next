import './globals.css'; // Optional: global styles
import Navbar from './components/global/navbar/navbar';

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
        <Navbar />
        {/* this is what needs to change in order to leave space for the navbar  */}
        <main className="ml-16 p-4 bg-slate-950 h-screen"> 
        {children}
        </main>
      </body>
    </html>
  );
}