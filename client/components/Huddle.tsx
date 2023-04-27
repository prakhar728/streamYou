import { useHuddle01 } from '@huddle01/react';
import { useEffect } from 'react';
 
function Huddle() {
  const { initialize,isInitialized } = useHuddle01();
  useEffect(() => {
    // its preferable to use env vars to store projectId
    initialize('YOUR_PROJECT_ID');
  }, []);
 
  return <div>{isInitialized ? 'Hello World!' : 'Please initialize'}</div>;
}

export default Huddle;