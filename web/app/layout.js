import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import BrandBackdrop from "@/components/brand/BrandBackdrop";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  applicationName: "Dentaloupe-XAI",
  title: "Dentaloupe-XAI · Deteksi Karies & Rekonstruksi 3D",
  description:
    "Deteksi karies anak dan rekonstruksi gigi 3D interaktif dari citra intraoral & panoramik",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Dentaloupe-XAI",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport = {
  themeColor: "#043162",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={poppins.variable}>
      <body>
        <BrandBackdrop />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
