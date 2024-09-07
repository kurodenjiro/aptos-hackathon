'use client'

import GoogleLogo from "@/components/GoogleLogo";
import { useKeylessAccount } from "@/context/KeylessAccountContext";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Header from "@/components/Header";
import { useGetNFTInBalance } from "@/hooks/useQuery";
import Apps from "@/components/Apps";


const Home = () =>{
    const router = useRouter()
    const [balance, setBalance] = useState<string|null>(null)
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [priceAPT, setPriceAPT] = useState<string|null>("5.7")
    const [isShow,setIsShow] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const { keylessAccount } = useKeylessAccount();
    const {fetchNFTs, NFTs} = useGetNFTInBalance()

    useEffect(()=>{
        if(!keylessAccount){
            router.push("/")
        }
        if(keylessAccount?.accountAddress){
            loadBalance()
            fetchNFTs()
        }
    },[keylessAccount])

    //console.log(NFTs)

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

    const loadBalance = useCallback(async() => {
        const options = {
            method: 'GET',
            headers: {accept: 'application/json'}
        };
        const respo = await axios.get(`https://aptos-testnet.nodit.io/${process.env.NEXT_PUBLIC_API_KEY_NODIT}/v1/accounts/${keylessAccount?.accountAddress.toString()}/resources`,options)
        const datas = respo?.data[1]
        const balance = datas?.data?.coin.value
        const formatBalance = Number(balance ? balance : 0)*Math.pow(10,-8)
        setBalance(formatBalance.toFixed(2))
    },[keylessAccount])

    const loadPriceAPT = useCallback(async()=>{
        try{
            const options = {
                method: 'GET',
                headers: {accept: 'application/json',"Access-Control-Allow-Origin":"*"}
            };
            const respo = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=aptos`,options)
            const tokenPrice = respo?.data[0]?.current_price
            setPriceAPT(tokenPrice)
        }catch(err){
            console.log("fetch coin api")
        }
    },[priceAPT])

    const tabs = ["Home","NFTs","Apps"]
    const actons = [
        {
            title: "Batch Mint NFTs",
            description: "Scale your art"
        },
        {
            title: "Create a Token Drop",
            description: "craft an image"
        },
        {
            title: "Wallet Overview",
            description: "summarize current address"
        }
    ]

    const onSetMessage = () =>{
        setLoading(true)
        router.push("/smart-actions/aaa")
    }

    return(
        keylessAccount
        &&(
            <div className="flex w-full h-screen flex-col">
                <Header/>
                <div className="flex flex-col w-screen items-center mt-20">
                    <div className="flex flex-row gap-5 items-center">
                        {tabs.map((tab,index)=>(
                            <button key={index} onClick={()=>setCurrentIndex(index)} className={`${currentIndex==index?"bg-gray-300":""} p-3 rounded-md bg-opacity-30 w-20 hover:bg-gray-100`}>
                                <span className="text-sm">{tab}</span>
                            </button>
                        ))}
                        <button onClick={()=>setIsShow(true)} className={`p-3 rounded-md bg-opacity-30 w-20 hover:bg-gray-100`}>
                            <span className="text-sm">AI</span>
                        </button>
                    </div>
                    <div className="flex flex-col mt-5 w-full items-center">
                        {
                            currentIndex == 0&&(
                                <div className="flex flex-col justify-center items-center">
                                    <div className="flex flex-row items-center gap-3">
                                        <span className="text-[3.5rem] font-semibold">{balance}</span>
                                        <span className="text-[3.5rem] font-semibold">APT</span>
                                    </div>
                                    <span className="text-lg text-[#b3b2b2]">Available Balance</span>
                                    <div className="mt-5 flex flex-row gap-4">
                                        <Link href={"/send"} className="w-[260px] text-center bg-gray-200 bg-opacity-70 rounded-md p-3 ">
                                            <span>Send</span>
                                        </Link>
                                        <Link href={"/receive"} className="w-[260px] text-center bg-gray-200 bg-opacity-70 rounded-md p-3 ">
                                            <span>Receive</span>
                                        </Link>
                                    </div>
                                    <div className="mt-7 w-full">
                                        <span className="text-lg">Token</span>
                                        <div className="mt-2 w-full flex flex-col gap-2">
                                            <div className="w-full border border-gray-200 shadow-sm rounded-md p-4 py-5 flex flex-row justify-between items-center">
                                                <div className="flex flex-row items-center gap-3">
                                                    <img width={40} src="/assets/icon.png" alt="icon" />
                                                    <span className="font-semibold text-xl">APTOS</span>
                                                </div>
                                                <div className="flex flex-col gap-2 text-center">
                                                    <span className="font-semibold text-xl">{balance}</span>
                                                    <span className="text-sm text-[#bdbdbd]">~ {priceAPT||balance? (parseFloat(balance as string)*parseFloat(priceAPT as string)).toFixed(2):"0.0"} USD</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        {
                            currentIndex ==1 &&(
                                <div className="flex flex-col justify-center text-start items-center">
                                    {
                                        NFTs?.current_token_ownerships_v2.length > 0?(
                                            <div>

                                            </div>
                                        ):(
                                            <div className="text-start flex justify-start items-start">
                                                <span>Looks like you don't have any NFTs yet!</span>
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        }
                        {
                            isShow&&(
                                <div className="fixed flex justify-center items-center z-20 w-full h-screen top-0 left-0 bg-black bg-opacity-60">
                                    <div className="max-w-4xl w-full h-2/4 bg-white rounded-md p-3 transition-all">
                                        <div className="flex flex-row justify-end items-end w-full">
                                            <button onClick={()=>setIsShow(false)} className="border border-gray-300 shadow-sm p-1 rounded-md">
                                                <img width={18} src="/assets/close.svg" alt="icon" />
                                            </button>
                                        </div>
                                        <div className="mt-1 flex justify-center w-full items-center flex-col">
                                            <img width={120} className="opacity-60" src="/assets/star.png" alt="star" />
                                            <span className="font-semibold text-xl -mt-5">Execute Transactions with AI</span>
                                        </div>
                                        <div className="flex flex-row mt-10 flex-wrap justify-between items-center px-3">
                                            {
                                                actons.map((dt,idx)=>(
                                                    <button onClick={onSetMessage} key={idx} className="flex flex-col gap-2 bg-gray-100 bg-opacity-60 rounded-md p-3 w-52">
                                                        <span>{dt.title}</span>
                                                        <span className="text-[#9b9a9a] text-sm">{dt.description}</span>
                                                    </button>
                                                ))
                                            }
                                            <button className="p-3 rounded-md bg-gray-100">
                                                <img width={25} src="/assets/reload.svg" alt="icon" />
                                            </button>
                                        </div>
                                        <div className="mt-5">
                                            <textarea className="h-20 border border-gray-300 shadow-sm rounded-md w-full p-2 outline-none focus:border-gray-600 focus:border-2" placeholder="Message Smart Actions"></textarea>
                                        </div>
                                        <div className="mt-5 flex justify-end">
                                            <button disabled={loading} className="p-2 bg-black rounded-md w-[200px] hover:bg-opacity-80 disabled:bg-gray-400">
                                                <span className="text-white">{loading ? (
                                                    <div className="flex flex-row gap-3 justify-center items-center">
                                                        <img width={20} src="/assets/reload-animation.svg" alt="icon" />
                                                        <span>Please wait</span>
                                                    </div>
                                                ) : "Send Message"}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        {
                            currentIndex == 2&&(
                                <Apps/>
                            )
                        }
                    </div>
                </div>
            </div>
        )
    )
}

export default Home;