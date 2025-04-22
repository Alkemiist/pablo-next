import './globals.css'; // Optional: global styles

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
      <body>{children}</body>
    </html>
  );
}