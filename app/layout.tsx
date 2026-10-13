import { Abyssinica_SIL, Bricolage_Grotesque, Inter } from "next/font/google";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";

const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

// The mobile app's wordmark face.
const brandSerif = Abyssinica_SIL({
  variable: "--font-brand-serif",
  weight: "400",
  subsets: ["latin"],
});

// Display face for the landing page's headlines.
const display = Bricolage_Grotesque({
  variable: "--font-display-sans",
  subsets: ["latin"],
});

// The page owns its scrolling: the landing page scrolls the window, while the
// admin and auth layouts wrap themselves in their own fixed-height scroller.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${interSans.variable} ${brandSerif.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-neutral-white">
        <QueryProvider>{children}</QueryProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
