"use client"
import Header from "@/components/Header";
import { useKeylessAccount } from "@/context/KeylessAccountContext";
import { collapseAddress } from "@/utils/address";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SmartActions = () =>{
    const {keylessAccount} = useKeylessAccount();
    const router = useRouter()

    useEffect(()=>{
        if(!keylessAccount) router.push("/")
    },[keylessAccount])

    return(
        keylessAccount&&(
            <div className="flex w-full h-screen flex-col">
                    <Header/>
                    <div className="flex flex-col w-screen px-20 items-center mt-20">
                        <div className="flex flex-row justify-between w-full">
                            <Link href={"/home"} className="p-2 flex items-center h-9 rounded-md border border-gray-200 shadow-sm">
                                <img width={20} src="/assets/arrow-left.svg" alt="icon" />
                            </Link>
                            <span className="p-2 text-2xl font-semibold">Smart Actions</span>
                            <button className="p-2 h-9 rounded-md border border-gray-300">
                                <img width={20} src="/assets/share.svg" alt="icon" />
                            </button>
                        </div>
                        <div className="max-w-xl mt-10 w-full">
                            <div className="border border-gray-300 rounded-md p-5 shadow-sm">
                                <div className="flex flex-row justify-between w-full items-center">
                                    <div className="flex flex-row gap-1">
                                        <img width={20} src="/assets/chat.svg" alt="icon" />
                                        <span>{collapseAddress(keylessAccount?.accountAddress.toString() as string)}</span>
                                    </div>
                                    <img width={20} src="/assets/arrow.svg" alt="icon" />
                                    
                                </div>
                                <div className="pb-5 border-b border-gray-200  w-full"/>
                                <div className="mt-5">
                                    <span className="text-sm">Generate and batch mint a collection of 3 NFTs inspired by constellations</span>
                                </div>
                            </div>
                        </div>
                        <div className="fixed bottom-10 w-full max-w-xl">
                            <div className="border border-gray-300 rounded-md p-3 w-full flex flex-row gap-4 items-center">
                                <input onKeyUp={(e)=>{
                                    if(e.key == "Enter"){
                                        console.log("enter")
                                    }
                                }} className="border border-gray-300 rounded-md outline-none p-3 w-full" placeholder="Message smart actions"/>
                                <button className="p-3 h-10 rounded-full border border-gray-300 shadow-sm hover:bg-gray-100">
                                    <img width={16} src="/assets/arrow-up.svg" alt="icon" />
                                </button>
                            </div>
                        </div>
                    </div>
            </div>
        )
    )
}

export default SmartActions;