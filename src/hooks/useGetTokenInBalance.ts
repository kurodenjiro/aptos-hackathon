import { getAptosClient } from "@/utils/aptosClient";
import { useKeylessAccount } from "@/context/KeylessAccountContext";
import { useCallback, useState } from "react";
import { queryTokenBalance } from "@/graphql/queryTokenInBalance";

const aptosClient = getAptosClient()

export const useGetTokenInBalance = () =>{
    const {keylessAccount} = useKeylessAccount();
    const [loading, setLoading] = useState<boolean>(false)
    const [tokens, setTokens] = useState<any>([])
    const fetchToken = useCallback(async() =>{
        if(!keylessAccount) return ;
        try{
            setLoading(true);
            const tokens =
                await aptosClient.queryIndexer({
                query: {
                    query: `query TokenInBalance{
                        current_fungible_asset_balances(
                            where: {owner_address: {_eq: ${keylessAccount?.accountAddress.toString()}}}
                        ) {
                            owner_address
                            amount
                            storage_id
                            last_transaction_version
                            last_transaction_timestamp
                            is_frozen
                            metadata {
                            asset_type
                            creator_address
                            decimals
                            icon_uri
                            name
                            project_uri
                            symbol
                            token_standard
                            maximum_v2
                            supply_v2
                            }
                        }
                        }`,
                },
            });
            console.log(tokens)
            setTokens(tokens)
        }catch(err){
            console.log("err fetch")
        }
    },[keylessAccount])
    return {
        fetchToken,
        tokens
    }
}
