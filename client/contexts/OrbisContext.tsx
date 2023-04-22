import React, { useContext, useEffect, useState } from "react";
import {useAccount} from "wagmi";
// @ts-ignore
import {Orbis} from "@orbisclub/orbis-sdk"
export const OrbisContext = React.createContext({
    user: null,
    orbis: null,
    GROUP_ID: "",
    CHANNEL_ID: "",
})

export const useOrbisContext = () => useContext(OrbisContext)

export const OrbisProvider = ({ children }: any) => {
    let orbis = new Orbis();
    const GROUP_ID = "kjzl6cwe1jw14axp80vka5y7ca38y09datmcu4bz0tz8xzntvn9la91292wfnhb"
    const CHANNEL_ID = "kjzl6cwe1jw147mzvzl256munwblyxczm01534guqvfr7c0duzgtxpg5hvcx8sy"

    const [user, setUser] = useState(null)
    const {isConnected, isConnecting, isDisconnected} = useAccount()

    useEffect(() => {
        if (!user && isConnected) {
            checkUserIsConnected().then((res) => {
                if(res === false){
                    connect()
                }
            })
        }
        if(user && isDisconnected) {
            logout()
        }
        if (!user && isConnecting) {
            checkUserIsConnected().then((res) => {
                if(res === false){
                    connect()
                }
            })
        }
    }, [user, isConnected, isConnecting, isDisconnected]);

    async function getProvider() {
        let provider = null;

        if(window.ethereum) {
            provider = window.ethereum;

            /** Return provider to use */
            return provider;
        }
    }

    const connect = async () => {
        let provider = await getProvider();
        let res = await orbis.connect_v2({provider, network: 'ethereum', lit: false});
        if(res.status == 200) {
            setUser(res.did);
            let {data, error} = await orbis.getIsGroupMember(GROUP_ID, res.did)
            if (!data){
                await orbis.setGroupMember(GROUP_ID, true)
            }
        } else {
            console.log("Error connecting to Ceramic: ", res);
            alert("Error connecting to Ceramic.");
        }
    }

    const checkUserIsConnected = async () => {
        let res = await orbis.isConnected();
        console.log("User is connected: ", res)

        /** If SDK returns user details we save it in state */
        if (res && res.status == 200) {
            setUser(res.details);
        }

        return res;
    }

    const logout = async () => {
        if (isDisconnected) {
            let res = await orbis.isConnected()
            if (res.status == 200) {
                await orbis.logout()
                setUser(null)
                console.log("User is connected: ", res);
            }
        }
    }

    console.log("User: ", user)

    return (
        <OrbisContext.Provider value={{
            user,
            orbis,
            GROUP_ID,
            CHANNEL_ID
        }}>
            {children}
        </OrbisContext.Provider>
    )
}