import React, {useEffect, useState} from 'react'
import Navbar from "../../../components/NavBar/NavBar";
import {Box, Button, Center, Divider, HStack, Heading, Image, Text, VStack, Flex} from '@chakra-ui/react';
import {useRouter} from 'next/router';
import {AiOutlinePlus, AiOutlinePlusSquare} from 'react-icons/ai';
import VideoGrid from "../../../components/VideoGrid/index";
import Head from 'next/head';
import {useIsMounted} from "../../../hooks/useIsMounted";
import {getCreator} from "../../../lib/polybase";
import {useAccount} from "wagmi";

export default function Creator() {
    const router = useRouter()
    const [creatorDetails, setCreatorDetails] = useState<any>({})
    const [isCreator, setIsCreator] = useState<boolean>(false)
    const {address} = useAccount()

    const mounted = useIsMounted()
    useEffect(() => {
        if (router.isReady && mounted) {
            getDetails()
        }
    }, [router.query, router.isReady, mounted])

    const getDetails = async () => {
        const {channelId} = router.query
        const creator = await getCreator(channelId as string)
        console.log(creator.response.data)
        setCreatorDetails(creator.response.data)
        // @ts-ignore
        if (address!.toLowerCase() === channelId!.split("-")[0].toLowerCase())
            setIsCreator(true)
    }

    return (
        <>
            <Head>
                <title>Creator</title>
            </Head>
            <Navbar>
                {/* <Box border={"1px"} borderColor={"black"} height="85vh" display={"flex"} p={3}>
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
        </Box> */}
                <Box w="100%" h="100%" display={"flex"} alignItems={"center"} flexDirection={"column"}
                     justifyContent={"space-evenly"} rowGap={3}>
                    <Box w="100%" display={"flex"} flexDirection={"row"} justifyContent={"space-between"} padding={25}
                         paddingX={85}>
                        <Flex>
                            <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                <Image src={creatorDetails?.image || ""} height={150}
                                       borderRadius={"50%"}/>
                            </Box>
                            <Box padding={2} display={"flex"} justifyContent={"space-evenly"} flexDirection={"column"}>
                                <Heading size={"lg"}>{creatorDetails?.name || "Loading..."}</Heading>
                                <Text size={"lg"} colorScheme={"gray"}>{creatorDetails?.id?.split("-")[0]}</Text>
                                <Text size={"lg"}>{creatorDetails?.description || "Loading..."}</Text>
                            </Box>
                        </Flex>
                        <Center p={2}>
                            {isCreator &&
                                <Button onClick={() => router.push("/app/videoupload")} colorScheme='blue'
                                        rightIcon={<AiOutlinePlus/>} size={"lg"}>Create </Button>
                            }
                        </Center>
                    </Box>
                    <Box w="80%" h="70%">
                        <Heading size={"lg"}>HOME</Heading>
                        <Box w="100%" border={"1px"} borderColor={"black"}></Box>
                        <VideoGrid videos={creatorDetails?.videos}/>
                    </Box>
                </Box>
            </Navbar>
        </>
    )
}