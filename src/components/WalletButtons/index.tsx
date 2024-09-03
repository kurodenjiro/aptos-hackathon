"use client";

import GoogleLogo from "../GoogleLogo";
import useEphemeralKeyPair from "@/hooks/useEphemeralKeyPair";
import { useKeylessAccount } from "@/context/KeylessAccountContext";
import { collapseAddress } from "@/utils/address";
import { toast } from "sonner";

const buttonStyles =
  "nes-btn flex items-center justify-center md:gap-4 py-2 flex-nowrap whitespace-nowrap";

export default function WalletButtons() {
  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    throw new Error("Google Client ID is not set in env");
  }

  const { keylessAccount, setKeylessAccount } = useKeylessAccount();
  const ephemeralKeyPair = useEphemeralKeyPair();

  const redirectUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  const searchParams = new URLSearchParams({
    /**
     * Replace with your own client ID
     */
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    /**
     * The redirect_uri must be registered in the Google Developer Console. This callback page
     * parses the id_token from the URL fragment and combines it with the ephemeral key pair to
     * derive the keyless account.
     */
    redirect_uri:
      typeof window !== "undefined"
        ? `${window.location.origin}/callback`
        : (process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : process.env.NEXT_PUBLIC_VERCEL_URL) + "/callback",
    /**
     * This uses the OpenID Connect implicit flow to return an id_token. This is recommended
     * for SPAs (single-page applications) as it does not require a backend server.
     */
    response_type: "id_token",
    scope: "openid email profile",
    nonce: ephemeralKeyPair.nonce,
  });
  redirectUrl.search = searchParams.toString();

  const disconnect = () => {
    setKeylessAccount(null);
    toast.success("Successfully disconnected account");
  };

  if(keylessAccount){
    return(
      <div className="flex flex-col items-center justify-center h-screen w-screen px-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome to Aptos!</h1>
          <p className="text-lg mb-8">You are now logged in</p>

          <div className="grid gap-2">
            <div className="flex justify-center items-center border rounded-lg px-8 py-2 shadow-sm cursor-not-allowed">
                <GoogleLogo />
                {collapseAddress(keylessAccount.accountAddress.toString())}
            </div>
            <button
              className="flex justify-center bg-red-50 items-center border border-red-200 rounded-lg px-8 py-2 shadow-sm shadow-red-300 hover:bg-red-100 active:scale-95 transition-all"
              onClick={disconnect}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="flex items-center justify-center h-screen w-screen px-4">
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
