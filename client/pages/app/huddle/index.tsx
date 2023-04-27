import { useHuddle01 } from '@huddle01/react';
import { useEffect } from 'react';
 import Navbar from "../../../components/NavBar/NavBar";
function Huddle() {
  const { initialize,isInitialized } = useHuddle01();
  useEffect(() => {
    // its preferable to use env vars to store projectId
    initialize('YOUR_PROJECT_ID');
  }, []);
 
  return <Navbar>{isInitialized ? 'Hello World!' : 'Please initialize'}</Navbar>;
}

export default Huddle;