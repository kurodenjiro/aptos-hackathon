"use client";

import GoogleLogo from "../GoogleLogo";
import useEphemeralKeyPair from "@/hooks/useEphemeralKeyPair";
import { useKeylessAccount } from "@/context/KeylessAccountContext";
import { collapseAddress } from "@/utils/address";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WalletButtons() {
  const router = useRouter();
  

  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    throw new Error("Google Client ID is not set in env");
  }

  const { keylessAccount } = useKeylessAccount();
  const ephemeralKeyPair = useEphemeralKeyPair();

  useEffect(()=>{
    if(keylessAccount){
      router.push("/home")
    }
  },[keylessAccount])


  const redirectUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  const searchParams = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    redirect_uri:
      typeof window !== "undefined"
        ? `${window.location.origin}/callback`
        : (process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : process.env.NEXT_PUBLIC_VERCEL_URL) + "/callback",
    response_type: "id_token",
    scope: "openid email profile",
    nonce: ephemeralKeyPair.nonce,
  });
  redirectUrl.search = searchParams.toString();

  return (
    <div className="flex items-center justify-center w-screen h-full">
      <div>
        <h1 className="text-4xl font-bold mb-2">Welcome to Aptos</h1>
        <p className="text-lg mb-8">
          Sign in with your Google account to continue
        </p>
        <a
          href={redirectUrl.toString()}
          className="flex justify-center items-center border rounded-lg px-8 py-2 hover:bg-gray-100 hover:shadow-sm active:bg-gray-50 active:scale-95 transition-all"
        >
          <GoogleLogo />
          Sign in with Google
        </a>
      </div>
    </div>
  );
}
