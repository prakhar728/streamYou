import React from "react";
import {useAccount, useSigner} from "wagmi";
import {useContract} from "../hooks/useContract";
import {getCreator} from "../lib/polybase";

export const CreatorContext = React.createContext({
    isCreator: false,
    creatorId: ""
})

export const useCreatorContext = () => React.useContext(CreatorContext)

export const CreatorProvider = ({children}: any) => {
    const {address} = useAccount()
    const {data: signer} = useSigner()
    const {getChainId} = useContract()
    const [creatorId, setCreatorId] = React.useState<string>("")
    const [isCreator, setIsCreator] = React.useState<boolean>(false)

    React.useEffect(() => {
        if (signer && address) {
            (async () => {
                const chainId = await getChainId()
                const id = `${address}-${chainId}`
                setCreatorId(id)
                try {
                    const isCreator = await getCreator(id)
                    console.log(isCreator)
                    if (isCreator)
                        setIsCreator(isCreator)
                } catch (e) {
                    setIsCreator(false)
                    console.log(e)
                }
            })()
        }
    }, [address, signer])

    return (
        <CreatorContext.Provider value={{isCreator, creatorId}}>
            {children}
        </CreatorContext.Provider>
    )
}

