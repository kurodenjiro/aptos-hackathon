"use client"
import { useKeylessAccount } from "@/context/KeylessAccountContext";
import { collapseAddress } from "@/utils/address";

const Header = () => {
    const { keylessAccount } = useKeylessAccount();
    return(
        <div className="w-full h-20 border-b border-gray-200 shadow-sm">
            <div className="p-2 px-5 h-full">
                <div className="flex flex-row justify-between items-center h-full w-full">
                    <span className="font-semibold text-3xl">AptosKeyless</span>
                    <div className="">
                        <span className="bg-blue-300 bg-opacity-30 px-3 py-2 rounded-md">{keylessAccount? collapseAddress(keylessAccount?.accountAddress.toString()): "Not Connected"}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;