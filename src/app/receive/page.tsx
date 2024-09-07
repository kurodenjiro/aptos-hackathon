'use client'

import { useKeylessAccount } from "@/context/KeylessAccountContext";
import { useState,useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getAptosClient } from "@/utils/aptosClient";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import Header from "@/components/Header";
import {QRCodeSVG} from 'qrcode.react';
import { collapseAddress } from "@/utils/address";
import {CopyToClipboard} from 'react-copy-to-clipboard';

const aptosClient = getAptosClient();

const Receive = () =>{
    const router = useRouter()
    const [currentIndex, setCurrentIndex] = useState<number>(Number(localStorage.getItem("indexTab"))??0)
    const { keylessAccount } = useKeylessAccount();

    useEffect(()=>{
        if(!keylessAccount){
            router.push("/")
        }
    },[keylessAccount])

    const onSelectIndex = (index: number) =>{
        setCurrentIndex(index)
        localStorage.setItem("indexTab",index.toString())
        if(index == 1) router.push("receive");
        if(index != 1) router.push("send")
    }

    console.log(currentIndex)

    return(
        <div className="flex flex-col h-screen w-screen items-center">
            <Header/>
            <div className="w-screen flex justify-center flex-col items-center mt-10">
                <div className="max-w-sm w-full">
                    <div className="flex flex-row w-full max-w-sm items-center">
                        <Link href={"/home"} className="p-2 flex items-center h-8 rounded-md border border-gray-200 shadow-sm">
                            <img width={20} src="/assets/arrow-left.svg" alt="icon" />
                        </Link>
                        <div className="flex flex-row justify-center w-full items-center ">
                            <div className="flex flex-row px-2 py-1 w-[170px] rounded-sm items-center bg-slate-200 bg-opacity-35 justify-between">
                                <button onClick={()=>onSelectIndex(0)} className={`${currentIndex==0 ? "bg-white text-black" : "text-slate-400"} px-3 py-1 rounded-sm`}>Send</button>
                                <button onClick={()=>onSelectIndex(1)} className={`${currentIndex==1 ? "bg-white text-black" : "text-slate-400"} px-3 py-1 rounded-sm`}>Receive</button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col mt-14 justify-center items-center w-full">
                        <QRCodeSVG
                            id='qrcode'
                            value={keylessAccount?.accountAddress.toString() as string}
                            size={140}
                            level={'H'}
                        />
                        
                        <div className="flex flex-row justify-between items-center mt-7 gap-5 px-3 py-2 rounded-md bg-gray-200">
                            <span>{collapseAddress(keylessAccount?.accountAddress.toString() as string)}</span>
                            <CopyToClipboard text={keylessAccount?.accountAddress.toString() as string}
                                onCopy={()=>alert("Copied")}
                            >
                                <button>
                                    <img width={20} src="/assets/copy.svg" alt="icon" />
                                </button>
                            </CopyToClipboard>
                        </div>
                        <div className="mt-14 w-full flex justify-center items-center">
                            <Link href={"/home"} className="w-[200px] flex text-center items-center justify-center rounded-md border border-gray-200 shadow-sm px-3 py-2">
                                <span>Done</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Receive;