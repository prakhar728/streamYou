import React, {ReactElement, useEffect} from 'react'
import NavBar from '../../components/NavBar/NavBar'
import {useAccount} from 'wagmi'
import {Polybase} from "@polybase/client";
import {useContract} from "../../hooks/useContract";
import {useIsMounted} from "../../hooks/useIsMounted";

const App = () => {
    const {address, isConnecting, isDisconnected, isConnected, isReconnecting} = useAccount()
    const {} = useContract()
    const mounted = useIsMounted()

    useEffect(() => {
        console.log("isConnected", isConnected, "isReconnecting", isReconnecting, "mounted", mounted)
        if(mounted && isConnected) {
            console.log("isConnected", isConnected, "isReconnecting", isReconnecting, "mounted", mounted)
        }
    }, [isConnected, isReconnecting, mounted])

    return (
        <div>
            <NavBar>
                {isDisconnected ? <div>Connect to Wallet to Continue!</div> : <>WorkingApp</>}
            </NavBar>
        </div>
    )
}


export default App


