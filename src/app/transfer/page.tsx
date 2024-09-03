'use client'

import { useKeylessAccount } from "@/context/KeylessAccountContext";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAptosClient } from "@/utils/aptosClient";
import axios from "axios";
import { toast } from "sonner";

const aptosClient = getAptosClient();

const Transfer = () =>{
    const router = useRouter()
    const [balance, setBalance] = useState<number>(0)
    const [amount, setAmount] = useState<string|null>(null)
    const [receive, setReceive] = useState<string|null>(null)
    const { keylessAccount } = useKeylessAccount();

    useEffect(()=>{
        if(!keylessAccount){
            router.push("/")
        }
        if(keylessAccount?.accountAddress){
            loadBalance()
        }
    },[keylessAccount])

    const loadBalance = async() => {
        const options = {
            method: 'GET',
            headers: {accept: 'application/json'}
        };
        const respo = await axios.get(`https://aptos-testnet.nodit.io/${process.env.NEXT_PUBLIC_API_KEY_NODIT}/v1/accounts/${keylessAccount?.accountAddress.toString()}/resources`,options)
        const datas = respo?.data[1]
        const balance = datas?.data?.coin.value
        const formatBalance = parseFloat(balance ? balance : 0)*Math.pow(10,-8)
        setBalance(formatBalance)
    }

    const onTransfer = async() => {
        if(!keylessAccount) return ;
        if(parseFloat(amount as string) > balance) return toast.error("Not enough balance");
        try{
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
            toast.success("Your pet was successfully minted!", {
                action: {
                    label: "Explorer",
                    onClick: () =>
                    window.open(
                        `https://explorer.aptoslabs.com/txn/${committedTxn.hash}?network=testnet`,
                        "_blank"
                    ),
                },
            });
        }catch(err){
            console.error("Error",err)
            toast.error("Failed to transfer token. Please try again.");
        }
    }

    return(
        <div className="flex flex-col items-center justify-center h-screen w-screen px-4">
            <div>
                <h1 className="text-4xl font-bold mb-2">Tranfer Token!</h1>
                <p className="text-lg mb-8">Example transfer token using aptos keyless</p>
                <div className="mt-5 flex flex-col gap-3">
                    <div>
                        <label htmlFor="amount">Amount</label>
                        <input onChange={(e)=>setAmount(e.target.value)} value={amount?amount:""} name="amount" type="text" className="border mt-1 rounded-lg px-3 py-2 shadow-sm w-full" placeholder="Enter amount"/>
                    </div>
                    <div className="mt-3">
                        <label htmlFor="amount">Address for receive</label>
                        <input onChange={(e)=>setReceive(e.target.value)} value={receive?receive:""} name="amount" type="text" className="border mt-1 rounded-lg px-3 py-2 shadow-sm w-full" placeholder="Enter address"/>
                    </div>
                    <button onClick={onTransfer} className="flex mt-4 w-full justify-center items-center border rounded-lg px-8 py-2 hover:bg-gray-100 hover:shadow-sm active:bg-gray-50 active:scale-95 transition-all">
                        <span className="font-semibold text-lg">Transfer</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Transfer;