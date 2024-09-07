const Apps = () =>{
    return(
        <div className="mt-16 gap-1 flex text-start flex-col">
            <span className="text-3xl font-semibold">Apps</span>
            <span className="text-[#bdbdbd] font-thin mt-2">Ready to use blockchain dapps</span>
            <div className="mt-5 md:w-[500px] w-full h-full border border-gray-300 shadow-sm rounded-md p-3">
                <div className="flex gap-10 flex-row justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <span className="text-xl font-semibold">Smart Actions</span>
                        <span className="text-sm text-[#868686]">Interact with the blockchain using AI.</span>
                    </div>
                    <button className="p-3 bg-black h-10 text-center flex justify-center items-center rounded-md">
                        <span className="text-white">Open</span>
                    </button>
                </div>
                <div className="mt-5 border border-gray-300 rounded-md p-3 w-full flex flex-row gap-4">
                    <input className="border border-gray-300 rounded-md outline-none p-2 w-full" placeholder="Message smart actions"/>
                    <button className="p-3 rounded-full border border-gray-300 shadow-sm hover:bg-gray-100">
                        <img width={20} src="/assets/arrow-up.svg" alt="icon" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Apps;