"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getLocalEphemeralKeyPair } from "@/hooks/useEphemeralKeyPair";
import { useRouter } from "next/navigation";
import { getAptosClient } from "@/utils/aptosClient";
import { EphemeralKeyPair } from "@aptos-labs/ts-sdk";
import { useKeylessAccount } from "@/context/KeylessAccountContext";
import { toast } from "sonner";

const parseJWTFromURL = (url: string): string | null => {
  const urlObject = new URL(url);
  const fragment = urlObject.hash.substring(1);
  const params = new URLSearchParams(fragment);
  return params.get("id_token");
};

function CallbackPage() {
  const { setKeylessAccount } = useKeylessAccount();
  const { push } = useRouter();

  useEffect(() => {

    async function deriveAccount() {
      const jwt = parseJWTFromURL(window.location.href);

      if (!jwt) {
        toast.error("No JWT found in URL. Please try logging in again.");
        return;
      }
      const payload = jwtDecode<{ nonce: string }>(jwt);
      const jwtNonce = payload.nonce;
      const ephemeralKeyPair = getLocalEphemeralKeyPair(jwtNonce);
      if (!ephemeralKeyPair) {
        toast.error(
          "No ephemeral key pair found for the given nonce. Please try logging in again."
        );
        return;
      }
      await createKeylessAccount(jwt, ephemeralKeyPair);
      push("/home");
    }

    deriveAccount();
  }, []);

  const createKeylessAccount = async (
    jwt: string,
    ephemeralKeyPair: EphemeralKeyPair
  ) => {
    const aptosClient = getAptosClient();
    const keylessAccount = await aptosClient.deriveKeylessAccount({
      jwt,
      ephemeralKeyPair,
    });

    const accountCoinsData = await aptosClient.getAccountCoinsData({
      accountAddress: keylessAccount?.accountAddress.toString(),
    });
    // account does not exist yet -> fund it
    if (accountCoinsData.length === 0) {
      try {
        await aptosClient.fundAccount({
          accountAddress: keylessAccount.accountAddress,
          amount: 200000000, // faucet 2 APT to create the account
        });
      } catch (error) {
        console.log("Error funding account: ", error);
        
      }
    }

    console.log("Keyless Account: ", keylessAccount.accountAddress.toString());
    setKeylessAccount(keylessAccount);
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="relative flex justify-center items-center border rounded-lg px-8 py-2 shadow-sm cursor-not-allowed tracking-wider">
        <span className="absolute flex h-3 w-3 -top-1 -right-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        Redirecting...
      </div>
    </div>
  );
}

export default CallbackPage;
