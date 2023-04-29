import { useHuddle01 } from '@huddle01/react';
import { useEffect } from 'react';
 import Navbar from "../../../components/NavBar/NavBar";
import { Box, Button } from '@chakra-ui/react';
import { useLobby } from '@huddle01/react/hooks';
function Huddle() {
  const { initialize,isInitialized } = useHuddle01();
  const { joinLobby } = useLobby();
  useEffect(() => {
    // its preferable to use env vars to store projectId
    
    if(process.env.NEXT_PUBLIC_PROJECT_ID)
    initialize(process.env.NEXT_PUBLIC_PROJECT_ID);
  }, []);
 
  return <Navbar>
    {isInitialized ? 'Hello World!' : 'Please initialize'}
    <Box>
    <Box>
      <Button disabled={joinLobby.isCallable} 
          onClick={() => joinLobby('YOUR_ROOM_ID')} colorScheme='blue'>Join Lobby</Button>
    </Box>
    </Box>
    
  </Navbar>;
}

export default Huddle;