import { Inter } from "next/font/google";
import "./globals.css";

const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${interSans.variable} h-full antialiased`}
    >
      <body className="flex flex-col h-screen overflow-hidden">
        <div className="scrollbar-thin scrollbar-thumb-gray-200 h-screen overflow-auto bg-neutral-white">
          {children}
        </div>
      </body>
    </html>
  );
}
