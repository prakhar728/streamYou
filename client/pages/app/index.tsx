import React, { ReactElement } from 'react'
import NavBar from '../../components/NavBar/NavBar'
import { useAccount } from 'wagmi'
import { Polybase } from "@polybase/client";

const App=()=> {
  const { address, isConnecting, isDisconnected } = useAccount()
  const db = new Polybase({
    defaultNamespace: "streamYou",
  });
  return (
    <div>
      <NavBar>
        {isDisconnected?<div>Connect to Wallet to Continue!</div>: <>WorkingApp</> }
      </NavBar>
    </div>
  )
}



export default App


