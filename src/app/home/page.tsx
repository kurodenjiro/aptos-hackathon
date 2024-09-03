'use client'

import GoogleLogo from "@/components/GoogleLogo";
import { useKeylessAccount } from "@/context/KeylessAccountContext";
import { collapseAddress } from "@/utils/address";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

const Home = () =>{
    const router = useRouter()
    const [balance, setBalance] = useState<string|null>(null)
    const { keylessAccount, setKeylessAccount } = useKeylessAccount();

    useEffect(()=>{
        if(!keylessAccount){
            router.push("/")
        }
        if(keylessAccount?.accountAddress){
            loadBalance()
        }
    },[keylessAccount])

    if(!keylessAccount){
        return(
            <div className="flex flex-col items-center justify-center h-screen w-screen px-4">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Welcome to Aptos!</h1>
                    <p className="text-lg mb-8">Please login</p>
                    <div className="grid gap-2">
                        <Link href="/" className="flex justify-center items-center border rounded-lg px-8 py-2 shadow-sm cursor-not-allowed">
                            <GoogleLogo />
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const loadBalance = async() => {
        const options = {
            method: 'GET',
            headers: {accept: 'application/json'}
        };
        const respo = await axios.get(`https://aptos-testnet.nodit.io/${process.env.NEXT_PUBLIC_API_KEY_NODIT}/v1/accounts/${keylessAccount?.accountAddress.toString()}/resources`,options)
        const datas = respo?.data[1]
        const balance = datas?.data?.coin.value
        const formatBalance = Number(balance ? balance : 0)*Math.pow(10,-8)
        setBalance(formatBalance.toFixed(2))
    }

    const disconnect = () => {
        setKeylessAccount(null);
        toast.success("Successfully disconnected account");
    };
    return(
        keylessAccount
        &&(<div className="flex flex-col items-center justify-center h-screen w-screen px-4">
            <div>
                <h1 className="text-4xl font-bold mb-2">Welcome to Aptos!</h1>
                <p className="text-lg mb-8">You are now logged in</p>
                <div className="grid gap-2">
                    <div className="flex justify-center items-center border rounded-lg px-8 py-2 shadow-sm cursor-not-allowed">
                        <GoogleLogo />
                        {collapseAddress(keylessAccount?.accountAddress.toString() as string)}
                    </div>
                    <div className="flex flex-row gap-3 justify-center items-center border rounded-lg px-8 py-2 shadow-sm cursor-not-allowed">
                        <span>Balance: </span>
                        <span>{balance ? balance : "-"} APT</span>
                    </div>
                    <Link href={"/transfer"} className="flex justify-center items-center border rounded-lg px-8 py-2 hover:bg-gray-100 hover:shadow-sm active:bg-gray-50 active:scale-95 transition-all">
                        Example Tranfer Token
                    </Link>
                    <button
                    className="flex justify-center bg-red-50 items-center border border-red-200 rounded-lg px-8 py-2 shadow-sm shadow-red-300 hover:bg-red-100 active:scale-95 transition-all"
                    onClick={disconnect}
                    >
                    Logout
                    </button>
                </div>
            </div>
        </div>)
    )
}

export default Home;