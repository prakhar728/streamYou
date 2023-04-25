import {useSigner} from "wagmi";

export const useContract = async () => {
    const {data: signer} = useSigner()
    const chainId = await signer?.getChainId()

}