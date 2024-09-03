import type { Metadata } from "next";
import { PropsWithChildren } from "react";
import { GeoTargetly } from "@/utils/GeoTargetly";
import { KeylessAccountProvider } from "@/context/KeylessAccountContext";
import { Toaster } from "sonner";
import "./globals.css";


export const metadata: Metadata = {
  title: "Aptos Keyless",
  description: "Aptos Keyless",
  // openGraph: {
  //   title: "Aptogotchi",
  //   description: "Aptogotchi - Your new favorite on-chain pet!",
  //   images: ["/aptogotchi.png"],
  // },
  // twitter: {
  //   card: "summary",
  //   site: "@Aptos_Network",
  //   title: "Aptogotchi",
  //   description: "Aptogotchi - Your new favorite on-chain pet!",
  //   images: ["/aptogotchi.png"],
  // },
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
      <body>
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
