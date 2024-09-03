import type { Metadata } from "next";
import { Kanit } from 'next/font/google'
import { PropsWithChildren } from "react";
import { GeoTargetly } from "@/utils/GeoTargetly";
import { KeylessAccountProvider } from "@/context/KeylessAccountContext";
import { Toaster } from "sonner";
import "./globals.css";

const martianMono = Kanit({ subsets: ['latin'],weight:'400' })

export const metadata: Metadata = {
  title: "Aptos Keyless",
  description: "Aptos Keyless",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="Rnm3DL87HNmPncIFwBLXPhy-WGFDXIyplSL4fRtnFsA"
        />
      </head>
      <body className={martianMono.className}>
        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            style: {
              letterSpacing: "0.02em",
            },
            className: "toast",
            duration: 5000,
          }}
          closeButton
          expand={true}
        />
        <KeylessAccountProvider>{children}</KeylessAccountProvider>
        <GeoTargetly />
      </body>
    </html>
  );
}
