import {useSigner} from "wagmi";
import {CONTRACT_ADDRESSES, streamYouAbi} from "../constants";
import {ethers} from "ethers";

export const useContract = () => {
    const {data: signer} = useSigner()

    /**
     * Get the contract address for the current network
     * @returns {Promise<string>}
     * */
    const getContractAddress = async () => {
        const provider = await signer?.provider
        const chainId = (await provider?.getNetwork())?.chainId
        // @ts-ignore
        return CONTRACT_ADDRESSES[chainId]
    }

    /**
     * Get the chain id for the current network
     * @returns {Promise<number>}
     */
    const getChainId = async () => {
        const provider = await signer?.provider
        return (await provider?.getNetwork())?.chainId
    }

    /**
     * Get the contract for the current network
     * @param {string} contractAddress
     * @returns {ethers.Contract}
     * */
    const getContract = (contractAddress: string) => {
        console.log("contractAddress", contractAddress, signer)
        return new ethers.Contract(contractAddress, streamYouAbi, signer!)
    }

    /**
     * Create a channel
     * @param {string} channelName
     * @returns {Promise<void>} success of transaction
     * */
    const createChannel = async (channelName: string)=> {
        const contractAddress = await getContractAddress()
        const contract = getContract(contractAddress)
        const creationFee = ethers.utils.parseEther("0.01")
        const tx = await contract.createChannel(channelName, {value: creationFee, gasLimit: 10000000})
        await tx.wait()
    }


    /**
     * Create a token
     * @param channelName
     * @param metadataUri
     * @param price
     * @returns {Promise<void>} success of transaction
     */
    const createToken = async (channelName: string, metadataUri: string, price: string) => {
        const contractAddress = await getContractAddress()
        const contract = getContract(contractAddress)
        const currentToken = parseInt(await getCurrentToken())
        const tx = await contract.createToken(channelName, metadataUri, ethers.utils.parseEther(price), currentToken + 1, {gasLimit: 10000000})
        await tx.wait()
    }

    /**
     * Get the current token
     * @returns {Promise<ethers.BigNumber>}
     */
    const getCurrentToken = async () => {
        const contractAddress = await getContractAddress()
        const contract = getContract(contractAddress)
        return await contract.totalSupply()
    }

    /**
     * Mint a token
     * @param price
     * @param tokenId
     * @returns {Promise<void>} success of transaction
     */
    const mintToken = async(price: string, tokenId: number) => {
        const contractAddress = await getContractAddress()
        const contract = getContract(contractAddress)
        const tx = await contract.mint(tokenId, {value: ethers.utils.parseEther(price)})
        await tx.wait()
    }

    /**
     * Get the balance of a token
     * @param address
     * @param tokenId
     * @returns {Promise<ethers.BigNumber>}
     */
    const balanceOf = async (address: string, tokenId: number) => {
        const contractAddress = await getContractAddress()
        const contract = getContract(contractAddress)
        return await contract.balanceOf(address, tokenId)
    }

    /**
     * Check if channel exists or not
     * @param channelName
     * @returns {Promise<boolean>}
     */
    const channelExists = async (channelName: string) => {
        const contractAddress = await getContractAddress()
        const contract = getContract(contractAddress)
        return await contract.channelExists(channelName)
    }

    /**
     * Get the metadata uri for a token
     * @param tokenId
     * @returns {Promise<string>}
     */
    const getTokenMetadataUri = async (tokenId: number) => {
        const contractAddress = await getContractAddress()
        const contract = getContract(contractAddress)
        return await contract.getTokenMetadataURI(tokenId)
    }

    /**
     * Get the uri for a token
     * @param tokenId
     * @returns {Promise<string>}
     */
    const getUriForToken = async (tokenId: number) => {
        const contractAddress = await getContractAddress()
        const contract = getContract(contractAddress)
        return await contract.uri(tokenId)
    }

    /**
     * Get the price of a token
     * @param tokenId
     * @returns {Promise<ethers.BigNumber>}
     */
    const getTokenPrice = async (tokenId: number) => {
        const contractAddress = await getContractAddress()
        const contract = getContract(contractAddress)
        return await contract.getTokenPrice(tokenId)
    }

    /**
     * Get the tokens for a channel
     * @param channelName
     * @returns {Promise<ethers.BigNumber[]>}
     */
    const getChannelTokens = async (channelName: string) => {
        const contractAddress = await getContractAddress()
        const contract = getContract(contractAddress)
        return await contract.getChannelTokens(channelName)
    }

    return {
        createChannel,
        createToken,
        getCurrentToken,
        mintToken,
        balanceOf,
        getTokenMetadataUri,
        getUriForToken,
        getTokenPrice,
        getChannelTokens,
        getChainId,
        channelExists
    }
}