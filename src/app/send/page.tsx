'use client'

import { useKeylessAccount } from "@/context/KeylessAccountContext";
import { useState,useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getAptosClient } from "@/utils/aptosClient";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import Header from "@/components/Header";

const aptosClient = getAptosClient();

const Transfer = () =>{
    const router = useRouter()
    const [balance, setBalance] = useState<number>(0)
    const [amount, setAmount] = useState<string|null>(null)
    const [receive, setReceive] = useState<string|null>(null)
    const [pending, setPending] = useState<boolean>(false)
    const [isShow, setIsShow] = useState<boolean>(false)
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [priceAPT, setPriceAPT] = useState<string|null>(null)
    const { keylessAccount } = useKeylessAccount();


    useEffect(()=>{
        if(!keylessAccount){
            router.push("/")
        }
        if(keylessAccount?.accountAddress){
            loadBalance()
        }
        loadPriceAPT()
    },[keylessAccount])

    const loadBalance = useCallback(async() => {
        const options = {
            method: 'GET',
            headers: {accept: 'application/json'}
        };
        const respo = await axios.get(`https://aptos-testnet.nodit.io/${process.env.NEXT_PUBLIC_API_KEY_NODIT}/v1/accounts/${keylessAccount?.accountAddress.toString()}/resources`,options)
        const datas = respo?.data[1]
        const balance = datas?.data?.coin.value
        const formatBalance = parseFloat(balance ? balance : 0)*Math.pow(10,-8)
        setBalance(formatBalance)
    },[keylessAccount])

    const loadPriceAPT = useCallback(async()=>{
        const options = {
            method: 'GET',
            headers: {accept: 'application/json'}
        };
        const respo = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=aptos`,options)
        const tokenPrice = respo?.data[0]?.current_price
        setPriceAPT(tokenPrice)
    },[priceAPT])

    const onTransfer = async() => {
        setPending(true)
        if(!keylessAccount) return ;
        if(parseFloat(amount as string) > balance) return toast.error("Not enough balance");
        try{
            toast.loading("Transtraction pending!")
            const transaction = await aptosClient.transferCoinTransaction({
                sender: keylessAccount?.accountAddress.toString(),
                recipient: receive!,
                amount: BigInt(Number(amount) * Math.pow(10,8)),
            });
            const committedTxn = await aptosClient.signAndSubmitTransaction({
                signer: keylessAccount,
                transaction,
            });
            await aptosClient.waitForTransaction({
                transactionHash: committedTxn.hash,
            });
            setAmount(null)
            setReceive(null)
            toast.success("Send Successful!", {
                action: {
                    label: "Explorer",
                    onClick: () =>
                    window.open(
                        `https://explorer.aptoslabs.com/txn/${committedTxn.hash}?network=testnet`,
                        "_blank"
                    ),
                },
            });
            setPending(false)
        }catch(err){
            console.error("Error",err)
            toast.error("Failed to transfer token. Please try again.");
            setPending(false)
        }
    }

    const onSelectIndex = (index: number) =>{
        setCurrentIndex(index)
        localStorage.setItem("indexTab",index.toString())
        if(index == 1) router.push("receive");
        if(index != 1) router.push("send")
    }

    const tabs = ["Send","Receive"]

    return(
        <div className="flex flex-col h-screen w-screen items-center">
            <Header/>
            <div className="w-screen flex justify-center flex-col items-center mt-10">
                <div className="max-w-sm w-full">
                    <div className="flex flex-row w-full max-w-md items-center">
                        <Link href={"/home"} className="p-2 flex items-center h-8 rounded-md border border-gray-200 shadow-sm">
                            <img width={20} src="/assets/arrow-left.svg" alt="icon" />
                        </Link>
                        <div className="flex flex-row justify-center w-full items-center ">
                            <div className="flex flex-row px-2 py-1 w-[170px] rounded-sm items-center bg-slate-200 bg-opacity-35 justify-between">
                                {
                                    tabs.map((tab,index)=>(
                                        <button onClick={()=>onSelectIndex(index)} key={index} className={`${index==currentIndex ? "bg-white text-black" : "text-slate-400"} px-3 py-1 rounded-sm`}>{tab}</button>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col mt-16 justify-center items-center">
                        <input onChange={(e)=>setAmount(e.target.value)} value={amount?amount:"0"} className="w-44 text-center outline-none border-none text-[3rem]" type="text" placeholder="0"/>
                        <span className="text-[#c4c4c4] mt-1">~{amount?(parseFloat(amount)*parseFloat(priceAPT as string)).toFixed(2):"0.0"}USD</span>
                        <div className="mt-10 flex flex-col gap-2">
                            <span className="text-[#c4c4c4]">Available: <strong className="text-black">{balance.toFixed(5)} APT</strong></span>
                            <button onClick={()=>setAmount(balance.toFixed(5))}>
                                <span className="underline">Use Max</span>
                            </button>
                        </div>
                        <div className="mt-10 w-full relative">
                            <div className="flex flex-col text-start relative">
                                <span>Asset</span>
                                <button onClick={()=>setIsShow((prv)=>!prv)} className="w-full flex flex-row justify-between items-center border px-3 py-2 border-gray-200 shadow-sm rounded-md h-12  mt-2">
                                    <div className="flex flex-row gap-3">
                                        <img width={20} height={20} className="w-6 h-6" src="/assets/icon.png" alt="icon" />
                                        <span>APTOS</span>
                                    </div>
                                    <img width={20} className="w-5 h-5" src="/assets/arrow-down.svg" alt="icon" />
                                </button>
                            </div>
                            {
                                isShow&&(
                                    <div className="absolute top-20 mt-1 border border-gray-200 rounded-md shadow-sm left-0 bg-white w-full p-1">
                                        <button onClick={()=>setIsShow(false)} className="w-full flex flex-row justify-between items-center px-2 h-10 hover:bg-slate-100">
                                            <div className="flex flex-row gap-3">
                                                <img width={20} height={20} className="w-6 h-6" src="/assets/icon.png" alt="icon" />
                                                <span>APTOS</span>
                                            </div>
                                        </button>
                                    </div>
                                )
                            }
                        </div>
                        <div className="mt-10 w-full">
                            <div className="flex flex-col text-start">
                                <span>Send to</span>
                                <input onChange={(e)=>setReceive(e.target.value)} className="w-full flex flex-row justify-between outline-none hover:border-2 hover:border-gray-500  focus:border-gray-500 items-center border px-3 py-2 border-gray-200 shadow-sm rounded-md h-12  mt-2" placeholder="Receive address"/>            
                            </div>
                        </div>
                        <div className="w-full mt-10 flex flex-row justify-between">
                            <Link href={"/home"} className="w-[160px] text-center border border-gray-200 shadow-sm px-3 py-2 rounded-md">
                                <span>Cancel</span>
                            </Link>
                            <button onClick={onTransfer} disabled={pending} className="w-[160px] bg-black text-white shadow-sm px-3 py-2 rounded-md">
                                <span>Send</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Transfer;