import WalletButtons from "@/components/WalletButtons";
import ClientOnly from "@/components/ClientOnly";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col">
      <Header/>
      <div className="flex flex-col h-full items-center justify-center w-screen">
        <ClientOnly>
          <WalletButtons />
        </ClientOnly>
      </div>
    </div>
  );
}

