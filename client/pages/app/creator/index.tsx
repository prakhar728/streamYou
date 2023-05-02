import React from 'react'
import Navbar from "../../../components/NavBar/NavBar";
import { Box, Divider, HStack, Heading, Image, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
const index = () => {
    const router = useRouter()
  return (
    <Navbar>
        <Box border={"1px"} borderColor={"black"} height="85vh" display={"flex"} p={3}>
            <Box  w="40%" minH={"fit-content"} maxH="50%" display={"flex"} alignItems={"center"} justifyContent={"center"} borderRadius={"20px"}>
                <Box border="1px" borderColor={"black"} borderRadius={"20px"} p={2}>
                <Image  borderRadius={"20px"} src={"https://pbs.twimg.com/media/FOHih5gWYAIbRPX?format=jpg&name=small"} objectFit='cover' boxSize={"sm"} />
                </Box>
            </Box>
            <VStack   w="60%"  >
                <Box height={"50%"} display={"flex"} flexDirection={"row"}
                alignItems={"center"}   w="100%" paddingLeft={4}>
                    <Heading  size={"2xl"} w="100%">CREATOR NAME</Heading>
                </Box>
                <VStack w="100%" h="40%" >
                    <Heading size="lg" w="100%">VIDEOS</Heading>
                    <Box border={"1px"} borderColor={"black"} w="100%"></Box>
                    <HStack w="100%" alignItems={"center"} h="100%" p={3} >
                        <Box  w="30%" h="100%"  alignItems={"center"} display={"flex"} >
                            <Image src={'https://www.wyzowl.com/wp-content/uploads/2019/09/YouTube-thumbnail-size-guide-best-practices-top-examples.png.webp'} onClick={()=>{
                                router.push(`DynamicURL`)
                            }} />
                        </Box>
                        
                    </HStack>
                </VStack>
            </VStack>
        </Box>
    </Navbar>
  )
}

export default index