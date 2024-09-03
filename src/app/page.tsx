import { Body } from "./home/Body";
import WalletButtons from "@/components/WalletButtons";
import ClientOnly from "@/components/ClientOnly";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen w-screen px-4">
      <div>
        <ClientOnly>
          <WalletButtons />
        </ClientOnly>
      </div>
    </div>
  );
}

